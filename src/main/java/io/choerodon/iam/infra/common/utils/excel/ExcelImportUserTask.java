package io.choerodon.iam.infra.common.utils.excel;

import io.choerodon.core.excel.ExcelExportHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ErrorUserDTO;
import io.choerodon.iam.api.dto.ExcelMemberRoleDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IRoleMemberService;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.common.utils.MockMultipartFile;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.dataobject.UploadHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.mapper.UploadHistoryMapper;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Pattern;
import java.util.stream.Collectors;


/**
 * @author superlee
 */
@RefreshScope
@Component
public class ExcelImportUserTask {
    private static final Logger logger = LoggerFactory.getLogger(ExcelImportUserTask.class);

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private MemberRoleRepository memberRoleRepository;
    private IRoleMemberService iRoleMemberService;
    private OrganizationUserService organizationUserService;
    private FileFeignClient fileFeignClient;
    private final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();


    public ExcelImportUserTask(UserRepository userRepository,
                               OrganizationUserService organizationUserService,
                               FileFeignClient fileFeignClient,
                               RoleRepository roleRepository,
                               MemberRoleRepository memberRoleRepository,
                               IRoleMemberService iRoleMemberService) {
        this.userRepository = userRepository;
        this.organizationUserService = organizationUserService;
        this.fileFeignClient = fileFeignClient;
        this.roleRepository = roleRepository;
        this.memberRoleRepository = memberRoleRepository;
        this.iRoleMemberService = iRoleMemberService;
    }

    @Async("excel-executor")
    public void importUsers(List<UserDO> users, Long organizationId, UploadHistoryDO uploadHistory, FinishFallback fallback) {
        logger.info("### begin to import users from excel, total size : {}", users.size());
        //线程安全arrayList，parallelStream并行处理过程中防止扩容数组越界
        List<UserDO> validateUsers = new CopyOnWriteArrayList<>();
        List<ErrorUserDTO> errorUsers = new CopyOnWriteArrayList<>();
        long begin = System.currentTimeMillis();
        users.parallelStream().forEach(u -> {
                    u.setOrganizationId(organizationId);
                    processUsers(u, errorUsers, validateUsers);
                }
        );
        //根据loginName和email去重，返回
        List<UserDO> distinctUsers = distinct(validateUsers, errorUsers);
        List<UserDO> insertUsers = compareWithDb(distinctUsers, errorUsers);
        long end = System.currentTimeMillis();
        logger.info("process user for {} millisecond", (end - begin));
        List<List<UserDO>> list = ListUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
        Integer successCount = insertUsers.size();
        Integer failedCount = errorUsers.size();
        uploadHistory.setSuccessfulCount(successCount);
        uploadHistory.setFailedCount(failedCount);
        uploadAndFallback(uploadHistory, fallback, errorUsers);
    }

    private void uploadAndFallback(UploadHistoryDO uploadHistoryDO, FinishFallback fallback, List<ErrorUserDTO> errorUsers) {
        String url = "";
        if (uploadHistoryDO.getFailedCount() > 0) {
            //失败的用户导出到excel
            try {
                long begin = System.currentTimeMillis();
                url = exportAndUpload(errorUsers);
                long end = System.currentTimeMillis();
                logger.info("export and upload file for {} millisecond", (end - begin));
                uploadHistoryDO.setFinished(true);
            } catch (CommonException e) {
                uploadHistoryDO.setFinished(false);
                throw e;
            } finally {
                uploadHistoryDO.setUrl(url);
                fallback.callback(uploadHistoryDO);
            }
        } else {
            //插入uploadHistory
            uploadHistoryDO.setUrl(url);
            uploadHistoryDO.setFinished(true);
            fallback.callback(uploadHistoryDO);
        }
    }

    @Async("excel-executor")
    public void importMemberRole(List<ExcelMemberRoleDTO> memberRoles, UploadHistoryDO uploadHistory,
                                  FinishFallback finishFallback) {
        Integer total = memberRoles.size();
        logger.info("### begin to import member-role from excel, total size : {}", total);
        List<ExcelMemberRoleDTO> errorMemberRoles = new CopyOnWriteArrayList<>();
        List<ExcelMemberRoleDTO> validateMemberRoles = new CopyOnWriteArrayList<>();
        memberRoles.parallelStream().forEach(mr -> {
            if (StringUtils.isEmpty(mr.getLoginName())) {
                mr.setCause("用户名为空");
                errorMemberRoles.add(mr);
            } else if (StringUtils.isEmpty(mr.getRoleCode())) {
                mr.setCause("角色编码为空");
                errorMemberRoles.add(mr);
            } else {
                validateMemberRoles.add(mr);
            }
        });
        //去重
        List<ExcelMemberRoleDTO> distinctList = distinctExcel(validateMemberRoles, errorMemberRoles);
        //***优化查询次数
        distinctList.parallelStream().forEach(emr -> {
            String loginName = emr.getLoginName();
            String code = emr.getRoleCode();
            //检查loginName是否存在
            UserDO userDO = getUser(errorMemberRoles, emr, loginName);
            if (userDO == null) return;
            Long userId = userDO.getId();
            //检查role code是否存在
            RoleDO role = getRole(errorMemberRoles, emr, code);
            if (role == null) return;
            if (!uploadHistory.getSourceType().equals(role.getLevel())) {
                emr.setCause("导入角色层级与导入所在界面的层级不匹配");
                errorMemberRoles.add(emr);
                return;
            }
            Long roleId = role.getId();
            //检查memberRole是否存在
            MemberRoleDO memberRole = getMemberRole(uploadHistory.getSourceId(), uploadHistory.getSourceType(), errorMemberRoles, emr, userId, roleId);
            if (memberRole == null) return;
            iRoleMemberService.insertAndSendEvent(memberRole, loginName);
        });
        Integer failedCount = errorMemberRoles.size();
        Integer successfulCount = total - failedCount;
        uploadHistory.setFailedCount(failedCount);
        uploadHistory.setSuccessfulCount(successfulCount);
        String url = "";
        if (failedCount > 0) {
            try {
                url = exportAndUploadMemberRole(errorMemberRoles);
                uploadHistory.setFinished(true);
            } catch (CommonException e) {
                uploadHistory.setFinished(false);
                throw e;
            } finally {
                uploadHistory.setUrl(url);
                finishFallback.callback(uploadHistory);
            }
        } else {
            uploadHistory.setUrl(url);
            uploadHistory.setFinished(true);
            finishFallback.callback(uploadHistory);
        }
    }

    private MemberRoleDO getMemberRole(Long sourceId, String sourceType, List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, Long userId, Long roleId) {
        MemberRoleDO memberRole = new MemberRoleDO();
        memberRole.setSourceType(sourceType);
        memberRole.setSourceId(sourceId);
        memberRole.setMemberType("user");
        memberRole.setMemberId(userId);
        memberRole.setRoleId(roleId);
        if (memberRoleRepository.selectOne(memberRole) != null) {
            emr.setCause("该用户已经被分配了该角色，sourceId={" + sourceId + "}");
            errorMemberRoles.add(emr);
            return null;
        }
        return memberRole;
    }

    private RoleDO getRole(List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, String code) {
        RoleDO roleDO = new RoleDO();
        roleDO.setCode(code);
        RoleDO role = roleRepository.selectOne(roleDO);
        if (role == null) {
            emr.setCause("角色编码不存在");
            errorMemberRoles.add(emr);
            return null;
        }
        return role;
    }

    private UserDO getUser(List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, String loginName) {
        UserDO user = new UserDO();
        user.setLoginName(loginName);
        UserDO userDO = userRepository.selectOne(user);
        if (userDO == null) {
            emr.setCause("用户名不存在");
            errorMemberRoles.add(emr);
            return null;
        }
        return userDO;
    }

    private List<ExcelMemberRoleDTO> distinctExcel(List<ExcelMemberRoleDTO> validateMemberRoles, List<ExcelMemberRoleDTO> errorMemberRoles) {
        List<ExcelMemberRoleDTO> distinctList = new ArrayList<>();
        //excel内去重
        Map<Map<String, String>, List<ExcelMemberRoleDTO>> distinctMap =
                validateMemberRoles.stream().collect(Collectors.groupingBy(m -> {
                    Map<String, String> map = new HashMap<>();
                    map.put(m.getLoginName(), m.getRoleCode());
                    return map;
                }));
        for (Map.Entry<Map<String, String>, List<ExcelMemberRoleDTO>> entry : distinctMap.entrySet()) {
            List<ExcelMemberRoleDTO> list = entry.getValue();
            distinctList.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ExcelMemberRoleDTO dto = list.get(i);
                    dto.setCause("excel中存在重复的数据");
                    errorMemberRoles.add(dto);
                }
            }
        }
        return distinctList;
    }

    private List<UserDO> compareWithDb(List<UserDO> validateUsers, List<ErrorUserDTO> errorUsers) {
        List<UserDO> insertList = new ArrayList<>();
        if (!validateUsers.isEmpty()) {
            Set<String> nameSet = validateUsers.stream().map(UserDO::getLoginName).collect(Collectors.toSet());
            Set<String> existedNames = userRepository.matchLoginName(nameSet);
            Set<String> emailSet = validateUsers.stream().map(UserDO::getEmail).collect(Collectors.toSet());
            Set<String> existedEmails = userRepository.matchEmail(emailSet);
            for (UserDO user : validateUsers) {
                boolean loginNameExisted = false;
                boolean emailExisted = false;
                if (existedNames.contains(user.getLoginName())) {
                    loginNameExisted = true;
                }
                if (existedEmails.contains(user.getEmail())) {
                    emailExisted = true;
                }
                if (loginNameExisted && emailExisted) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(user, dto);
                    dto.setPassword(user.getOriginalPassword());
                    dto.setCause("邮箱和登录名都已存在");
                    errorUsers.add(dto);
                } else if (!loginNameExisted && emailExisted) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(user, dto);
                    dto.setPassword(user.getOriginalPassword());
                    dto.setCause("邮箱已存在");
                    errorUsers.add(dto);
                } else if (loginNameExisted && !emailExisted) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(user, dto);
                    dto.setPassword(user.getOriginalPassword());
                    dto.setCause("登录名已存在");
                    errorUsers.add(dto);
                } else {
                    insertList.add(user);
                }
            }
        }
        return insertList;
    }

    private List<UserDO> distinct(List<UserDO> users, List<ErrorUserDTO> errorUsers) {
        List<UserDO> distinctNameAndEmail = distinctNameAndEmail(users, errorUsers);
        Map<String, List<UserDO>> loginNameMap =
                distinctNameAndEmail.stream().collect(Collectors.groupingBy(UserDO::getLoginName));
        Map<String, List<UserDO>> emailMap =
                distinctNameAndEmail.stream().collect(Collectors.groupingBy(UserDO::getEmail));
        List<UserDO> distinct = new ArrayList<>();
        //去除loginName和email与其他对象相同的情况
        for (Map.Entry<String, List<UserDO>> entry : loginNameMap.entrySet()) {
            List<UserDO> list = entry.getValue();
            if (list.size() > 1) {
                for (UserDO user : list) {
                    String email = user.getEmail();
                    if (emailMap.get(email).size() > 1) {
                        ErrorUserDTO dto = new ErrorUserDTO();
                        BeanUtils.copyProperties(user, dto);
                        dto.setCause("Excel中存在重复的用户名和密码");
                        errorUsers.add(dto);
                    } else {
                        distinct.add(user);
                    }

                }
            } else {
                distinct.add(list.get(0));
            }
        }
        //loginName去重
        List<UserDO> distinctNameList = distinctLoginName(errorUsers, distinct);
        //email去重
        List<UserDO> returnList = distinctEmail(errorUsers, distinctNameList);
        return returnList;
    }

    private List<UserDO> distinctLoginName(List<ErrorUserDTO> errorUsers, List<UserDO> distinct) {
        List<UserDO> distinctNameList = new ArrayList<>();
        Map<String, List<UserDO>> loginNameMap = distinct.stream().collect(Collectors.groupingBy(UserDO::getLoginName));
        for (Map.Entry<String, List<UserDO>> entry : loginNameMap.entrySet()) {
            List<UserDO> list = entry.getValue();
            distinctNameList.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(list.get(i), dto);
                    dto.setCause("Excel中存在重复的用户名");
                    errorUsers.add(dto);
                }
            }
        }
        return distinctNameList;
    }

    private List<UserDO> distinctEmail(List<ErrorUserDTO> errorUsers, List<UserDO> distinctNameList) {
        List<UserDO> returnList = new ArrayList<>();
        Map<String, List<UserDO>> emailMap
                = distinctNameList.stream().collect(Collectors.groupingBy(UserDO::getEmail));
        for (Map.Entry<String, List<UserDO>> entry : emailMap.entrySet()) {
            List<UserDO> list = entry.getValue();
            returnList.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(list.get(i), dto);
                    dto.setCause("Excel中存在重复的邮箱");
                    errorUsers.add(dto);
                }
            }
        }
        return returnList;
    }

    /**
     * 去除同一个对象loginName和email完全相同的对象
     * @param users
     * @param errorUsers
     * @return
     */
    private List<UserDO> distinctNameAndEmail(List<UserDO> users, List<ErrorUserDTO> errorUsers) {
        List<UserDO> distinctNameAndEmail = new ArrayList<>();
        Map<Map<String, String>, List<UserDO>> nameAndEmailMap =
                users.stream().collect(Collectors.groupingBy(u -> {
                    Map<String, String> map = new HashMap<>();
                    map.put(u.getLoginName(), u.getEmail());
                    return map;
                }));
        //去掉两个字段全重复的对象
        for (Map.Entry<Map<String, String>, List<UserDO>> entry : nameAndEmailMap.entrySet()) {
            List<UserDO> list = entry.getValue();
            distinctNameAndEmail.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = new ErrorUserDTO();
                    BeanUtils.copyProperties(list.get(i), dto);
                    dto.setCause("Excel中存在重复的用户名和邮箱");
                    errorUsers.add(dto);
                }
            }
        }
        return distinctNameAndEmail;
    }

    private String exportAndUpload(List<ErrorUserDTO> errorUsers) {
        Map<String, String> propertyMap = new LinkedHashMap<>();
        propertyMap.put("loginName", "登录名*");
        propertyMap.put("realName", "用户名*");
        propertyMap.put("email", "邮箱*");
        propertyMap.put("password", "密码");
        propertyMap.put("phone", "手机号");
        propertyMap.put("cause", "原因");
        HSSFWorkbook hssfWorkbook;
        try {
            hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap,errorUsers,"error users",ErrorUserDTO.class);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            logger.error("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.export");
        }
        return upload(hssfWorkbook,"errorUser.xls", "error-user");
    }

    private String upload(HSSFWorkbook hssfWorkbook, String originalFilename, String bucketName) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        String url;
        try {
            hssfWorkbook.write(bos);
            MockMultipartFile multipartFile =
                    new MockMultipartFile("file",originalFilename,"application/vnd.ms-excel", bos.toByteArray());
            url = fileFeignClient.uploadFile(bucketName, multipartFile.getOriginalFilename(), multipartFile).getBody();
        } catch (IOException e) {
            logger.error("HSSFWorkbook to ByteArrayOutputStream failed, exception: {}", e.getMessage());
            throw new CommonException("error.byteArrayOutputStream");
        } catch (Exception e) {
            logger.error("feign invoke exception : {}", e.getMessage());
            throw new CommonException("error.feign.invoke");
        } finally {
            try {
                bos.close();
            } catch (IOException e) {
                logger.info("byteArrayOutputStream close failed, exception: {}", e.getMessage());
            }
        }
        return url;
    }

    private String exportAndUploadMemberRole(List<ExcelMemberRoleDTO> errorMemberRoles) {
        Map<String, String> propertyMap = new LinkedHashMap<>();
        propertyMap.put("loginName", "登录名*");
        propertyMap.put("roleCode", "角色编码*");
        propertyMap.put("cause", "原因");
        HSSFWorkbook hssfWorkbook;
        try {
            hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap, errorMemberRoles,"error",ExcelMemberRoleDTO.class);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            logger.error("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.export");
        }
        return upload(hssfWorkbook, "errorMemberRole.xls", "error-member-role");
    }

    private void processUsers(UserDO user, List<ErrorUserDTO> errorUsers, List<UserDO> validateUsers) {
        //只有校验通过的用户才进行其他字段设置
        if (validateUsers(user, errorUsers, validateUsers)) {
            //excel中用户密码为空，设置默认密码为abcd1234
            user.setOriginalPassword(user.getPassword());
            if (StringUtils.isEmpty(user.getPassword())) {
                user.setPassword("abcd1234");
            }
            //加密
            user.setPassword(ENCODER.encode(user.getPassword()));
            if (StringUtils.isEmpty(user.getLanguage())) {
                user.setLanguage("zh_CN");
            }
            if (StringUtils.isEmpty(user.getTimeZone())) {
                user.setTimeZone("CTT");
            }
            user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
            user.setEnabled(true);
            user.setLocked(false);
            user.setLdap(false);
            user.setAdmin(false);
        }
    }

    private Boolean validateUsers(UserDO user, List<ErrorUserDTO> errorUsers, List<UserDO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        String realName = user.getRealName();
        String phone = user.getPhone();
        Boolean ok = false;
        if (StringUtils.isEmpty(loginName) || StringUtils.isEmpty(email)) {
            //乐观认为大多数是正确的，所以new 对象放到了if 里面
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("登录名或邮箱为空");
            errorUsers.add(errorUser);
        } else if (loginName.length() > 128) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("登陆名长度超过128位");
            errorUsers.add(errorUser);
        } else if (!Pattern.matches(UserDTO.EMAIL_REGULAR_EXPRESSION, email)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("非法的邮箱格式");
            errorUsers.add(errorUser);
        } else if (!StringUtils.isEmpty(realName) && realName.length() > 32) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("用户名超过32位");
            errorUsers.add(errorUser);
        } else if (!StringUtils.isEmpty(phone) && !Pattern.matches(UserDTO.PHONE_REGULAR_EXPRESSION, phone)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("手机号格式不正确");
            errorUsers.add(errorUser);
        } else {
            ok = true;
            insertUsers.add(user);
        }
        return ok;
    }


    public interface FinishFallback {
        /**
         * 同步完成后回调
         *
         * @param uploadHistoryDO 历史纪录
         */
        void callback(UploadHistoryDO uploadHistoryDO);
    }


    @Component
    public class FinishFallbackImpl implements FinishFallback {

        private UploadHistoryMapper uploadHistoryMapper;

        public FinishFallbackImpl(UploadHistoryMapper uploadHistoryMapper) {
            this.uploadHistoryMapper = uploadHistoryMapper;
        }

        @Override
        public void callback(UploadHistoryDO uploadHistoryDO) {
            UploadHistoryDO history = uploadHistoryMapper.selectByPrimaryKey(uploadHistoryDO.getId());
            history.setEndTime(new Date((System.currentTimeMillis())));
            history.setSuccessfulCount(uploadHistoryDO.getSuccessfulCount());
            history.setFailedCount(uploadHistoryDO.getFailedCount());
            history.setUrl(uploadHistoryDO.getUrl());
            history.setFinished(uploadHistoryDO.getFinished());
            history.setSourceId(uploadHistoryDO.getSourceId());
            history.setSourceType(uploadHistoryDO.getSourceType());
            uploadHistoryMapper.updateByPrimaryKeySelective(history);
        }
    }
}
