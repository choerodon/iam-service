package io.choerodon.iam.infra.common.utils.excel;

import io.choerodon.core.excel.ExcelExportHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ErrorUserDTO;
import io.choerodon.iam.api.dto.ExcelMemberRoleDTO;
import io.choerodon.iam.api.validator.UserPasswordValidator;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.app.service.RoleMemberService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.common.utils.CollectionUtils;
import io.choerodon.iam.infra.common.utils.MockMultipartFile;
import io.choerodon.iam.infra.dto.MemberRoleDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.dto.UploadHistoryDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;
import io.choerodon.iam.infra.mapper.UploadHistoryMapper;
import io.choerodon.iam.infra.mapper.UserMapper;
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
    private static final String ADD_USER = "addUser";

    private RoleMemberService roleMemberService;
    private OrganizationUserService organizationUserService;
    private FileFeignClient fileFeignClient;
    private UserService userService;
    private UserPasswordValidator userPasswordValidator;
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private UserMapper userMapper;

    private RoleMapper roleMapper;

    private MemberRoleMapper memberRoleMapper;

    public ExcelImportUserTask(RoleMemberService roleMemberService,
                               OrganizationUserService organizationUserService,
                               FileFeignClient fileFeignClient,
                               UserService userService,
                               UserPasswordValidator userPasswordValidator,
                               UserMapper userMapper,
                               RoleMapper roleMapper,
                               MemberRoleMapper memberRoleMapper) {
        this.roleMemberService = roleMemberService;
        this.organizationUserService = organizationUserService;
        this.fileFeignClient = fileFeignClient;
        this.userService = userService;
        this.userPasswordValidator = userPasswordValidator;
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.memberRoleMapper = memberRoleMapper;
    }

    @Async("excel-executor")
    public void importUsers(Long userId, List<UserDTO> users, Long organizationId, UploadHistoryDTO uploadHistory, FinishFallback fallback) {
        logger.info("### begin to import users from excel, total size : {}", users.size());
        List<UserDTO> validateUsers = new ArrayList<>();
        List<ErrorUserDTO> errorUsers = new ArrayList<>();
        long begin = System.currentTimeMillis();
        users.forEach(u -> {
                    u.setOrganizationId(organizationId);
                    processUsers(u, errorUsers, validateUsers);
                }
        );
        //根据loginName和email去重，返回
        List<UserDTO> distinctUsers = distinctUsers(validateUsers, errorUsers);
        List<UserDTO> insertUsers = compareWithDb(distinctUsers, errorUsers);
        long end = System.currentTimeMillis();
        logger.info("process user for {} millisecond", (end - begin));
        List<List<UserDTO>> list = CollectionUtils.subList(insertUsers, 1000);
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
        if (successCount > 0) {
            sendNotice(successCount, userId, organizationId);
        }
    }

    private void sendNotice(Integer successCount, Long userId, Long organizationId) {
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("addCount", successCount);
        List<Long> userIds = new ArrayList<>();
        userIds.add(userId);
        userService.sendNotice(userId, userIds, ADD_USER, paramsMap, organizationId);
        logger.info("batch import user send station letter.");
    }

    private void uploadAndFallback(UploadHistoryDTO uploadHistoryDTO, FinishFallback fallback, List<ErrorUserDTO> errorUsers) {
        String url = "";
        if (uploadHistoryDTO.getFailedCount() > 0) {
            //失败的用户导出到excel
            try {
                long begin = System.currentTimeMillis();
                url = exportAndUpload(errorUsers);
                long end = System.currentTimeMillis();
                logger.info("export and upload file for {} millisecond", (end - begin));
                uploadHistoryDTO.setFinished(true);
            } catch (CommonException e) {
                uploadHistoryDTO.setFinished(false);
                throw e;
            } finally {
                uploadHistoryDTO.setUrl(url);
                fallback.callback(uploadHistoryDTO);
            }
        } else {
            //插入uploadHistory
            uploadHistoryDTO.setUrl(url);
            uploadHistoryDTO.setFinished(true);
            fallback.callback(uploadHistoryDTO);
        }
    }

    @Async("excel-executor")
    public void importMemberRole(List<ExcelMemberRoleDTO> memberRoles, UploadHistoryDTO uploadHistory,
                                 FinishFallback finishFallback) {
        Integer total = memberRoles.size();
        logger.info("### begin to import member-role from excel, total size : {}", total);
        List<ExcelMemberRoleDTO> errorMemberRoles = new CopyOnWriteArrayList<>();
        List<ExcelMemberRoleDTO> validateMemberRoles = new CopyOnWriteArrayList<>();
        memberRoles.parallelStream().forEach(mr -> {
            if (StringUtils.isEmpty(mr.getLoginName())) {
                mr.setCause("登录名为空");
                errorMemberRoles.add(mr);
            } else if (StringUtils.isEmpty(mr.getRoleCode())) {
                mr.setCause("角色编码为空");
                errorMemberRoles.add(mr);
            } else {
                validateMemberRoles.add(mr);
            }
        });
        //去重
        List<ExcelMemberRoleDTO> distinctList = distinctMemberRole(validateMemberRoles, errorMemberRoles);
        //***优化查询次数
        distinctList.parallelStream().forEach(emr -> {
            String loginName = emr.getLoginName().trim();
            String code = emr.getRoleCode().trim();
            //检查loginName是否存在
            UserDTO userDTO = getUser(errorMemberRoles, emr, loginName);
            if (userDTO == null) {
                return;
            }
            Long userId = userDTO.getId();
            //检查role code是否存在
            RoleDTO role = getRole(errorMemberRoles, emr, code);
            if (role == null) {
                return;
            }
            if (!uploadHistory.getSourceType().equals(role.getResourceLevel())) {
                emr.setCause("导入角色层级与导入所在界面的层级不匹配");
                errorMemberRoles.add(emr);
                return;
            }
            Long roleId = role.getId();
            //检查memberRole是否存在
            MemberRoleDTO memberRole = getMemberRole(uploadHistory.getSourceId(), uploadHistory.getSourceType(), errorMemberRoles, emr, userId, roleId);
            if (memberRole == null) {
                return;
            }
            roleMemberService.insertAndSendEvent(memberRole, loginName);
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

    private MemberRoleDTO getMemberRole(Long sourceId, String sourceType, List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, Long userId, Long roleId) {
        MemberRoleDTO memberRole = new MemberRoleDTO();
        memberRole.setSourceType(sourceType);
        memberRole.setSourceId(sourceId);
        memberRole.setMemberType("user");
        memberRole.setMemberId(userId);
        memberRole.setRoleId(roleId);
        if (memberRoleMapper.selectOne(memberRole) != null) {
            emr.setCause("该用户已经被分配了该角色，sourceId={" + sourceId + "}");
            errorMemberRoles.add(emr);
            return null;
        }
        return memberRole;
    }

    private RoleDTO getRole(List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, String code) {
        RoleDTO roleDTO = new RoleDTO();
        roleDTO.setCode(code);
        RoleDTO role = roleMapper.selectOne(roleDTO);
        if (role == null) {
            emr.setCause("角色编码不存在");
            errorMemberRoles.add(emr);
            return null;
        }
        return role;
    }

    private UserDTO getUser(List<ExcelMemberRoleDTO> errorMemberRoles, ExcelMemberRoleDTO emr, String loginName) {
        UserDTO user = new UserDTO();
        user.setLoginName(loginName);
        UserDTO userDTO = userMapper.selectOne(user);
        if (userDTO == null) {
            emr.setCause("登录名不存在");
            errorMemberRoles.add(emr);
            return null;
        }
        return userDTO;
    }

    /**
     * 导入member-role去重
     * 去重策略，根据loginName和code分组，value集合大于1，则有重复的，将重复的集合放入error集合中
     *
     * @param validateMemberRoles 源集合
     * @param errorMemberRoles    重复的数据集合
     * @return
     */
    private List<ExcelMemberRoleDTO> distinctMemberRole(List<ExcelMemberRoleDTO> validateMemberRoles, List<ExcelMemberRoleDTO> errorMemberRoles) {
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

    private List<UserDTO> compareWithDb(List<UserDTO> validateUsers, List<ErrorUserDTO> errorUsers) {
        List<UserDTO> insertList = new ArrayList<>();
        if (!validateUsers.isEmpty()) {
            Set<String> nameSet = validateUsers.stream().map(UserDTO::getLoginName).collect(Collectors.toSet());
            //oracle In-list上限为1000，这里List size要小于1000
            List<Set<String>> subNameSet = CollectionUtils.subSet(nameSet, 999);
            Set<String> existedNames = new HashSet<>();
            subNameSet.forEach(set -> existedNames.addAll(userMapper.matchLoginName(set)));
            Set<String> emailSet = validateUsers.stream().map(UserDTO::getEmail).collect(Collectors.toSet());
            List<Set<String>> subEmailSet = CollectionUtils.subSet(emailSet, 999);
            Set<String> existedEmails = new HashSet<>();
            subEmailSet.forEach(set -> existedEmails.addAll(userMapper.matchEmail(set)));
            for (UserDTO user : validateUsers) {
                boolean loginNameExisted = false;
                boolean emailExisted = false;
                if (existedNames.contains(user.getLoginName())) {
                    loginNameExisted = true;
                }
                if (existedEmails.contains(user.getEmail())) {
                    emailExisted = true;
                }
                if (loginNameExisted && emailExisted) {
                    ErrorUserDTO dto = getErrorUserDTO(user, "邮箱和登录名都已存在");
                    dto.setPassword(user.getOriginalPassword());
                    errorUsers.add(dto);
                } else if (!loginNameExisted && emailExisted) {
                    ErrorUserDTO dto = getErrorUserDTO(user, "邮箱已存在");
                    dto.setPassword(user.getOriginalPassword());
                    errorUsers.add(dto);
                } else if (loginNameExisted && !emailExisted) {
                    ErrorUserDTO dto = getErrorUserDTO(user, "登录名已存在");
                    dto.setPassword(user.getOriginalPassword());
                    errorUsers.add(dto);
                } else {
                    insertList.add(user);
                }
            }
        }
        return insertList;
    }

    /**
     * 导入用户去重
     * 前置，loginName和email都是唯一的
     * 1. 先根据loginName和email分组，剔除loginName和email都重复的数据
     *
     * @param users
     * @param errorUsers
     * @return
     */
    private List<UserDTO> distinctUsers(List<UserDTO> users, List<ErrorUserDTO> errorUsers) {
        List<UserDTO> distinctNameAndEmail = distinctNameAndEmail(users, errorUsers);
        Map<String, List<UserDTO>> loginNameMap =
                distinctNameAndEmail.stream().collect(Collectors.groupingBy(UserDTO::getLoginName));
        Map<String, List<UserDTO>> emailMap =
                distinctNameAndEmail.stream().collect(Collectors.groupingBy(UserDTO::getEmail));
        List<UserDTO> distinct = new ArrayList<>();
        //去除loginName和email与其他对象相同的情况
        for (Map.Entry<String, List<UserDTO>> entry : loginNameMap.entrySet()) {
            List<UserDTO> list = entry.getValue();
            if (list.size() > 1) {
                for (UserDTO user : list) {
                    String email = user.getEmail();
                    if (emailMap.get(email).size() > 1) {
                        ErrorUserDTO dto = getErrorUserDTO(user, "Excel中存在重复的登录名和密码");
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
        List<UserDTO> distinctNameList = distinctLoginName(errorUsers, distinct);
        //email去重
        return distinctEmail(errorUsers, distinctNameList);
    }

    private List<UserDTO> distinctLoginName(List<ErrorUserDTO> errorUsers, List<UserDTO> distinct) {
        List<UserDTO> distinctNameList = new ArrayList<>();
        Map<String, List<UserDTO>> loginNameMap = distinct.stream().collect(Collectors.groupingBy(UserDTO::getLoginName));
        for (Map.Entry<String, List<UserDTO>> entry : loginNameMap.entrySet()) {
            List<UserDTO> list = entry.getValue();
            distinctNameList.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = getErrorUserDTO(list.get(i), "Excel中存在重复的登录名");
                    errorUsers.add(dto);
                }
            }
        }
        return distinctNameList;
    }

    private List<UserDTO> distinctEmail(List<ErrorUserDTO> errorUsers, List<UserDTO> distinctNameList) {
        List<UserDTO> returnList = new ArrayList<>();
        Map<String, List<UserDTO>> emailMap
                = distinctNameList.stream().collect(Collectors.groupingBy(UserDTO::getEmail));
        for (Map.Entry<String, List<UserDTO>> entry : emailMap.entrySet()) {
            List<UserDTO> list = entry.getValue();
            returnList.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = getErrorUserDTO(list.get(i), "Excel中存在重复的邮箱");
                    errorUsers.add(dto);
                }
            }
        }
        return returnList;
    }

    /**
     * 去除同一个对象loginName和email完全相同的对象
     *
     * @param users
     * @param errorUsers
     * @return
     */
    private List<UserDTO> distinctNameAndEmail(List<UserDTO> users, List<ErrorUserDTO> errorUsers) {
        List<UserDTO> distinctNameAndEmail = new ArrayList<>();
        Map<Map<String, String>, List<UserDTO>> nameAndEmailMap =
                users.stream().collect(Collectors.groupingBy(u -> {
                    Map<String, String> map = new HashMap<>();
                    map.put(u.getLoginName(), u.getEmail());
                    return map;
                }));
        //去掉两个字段全重复的对象
        for (Map.Entry<Map<String, String>, List<UserDTO>> entry : nameAndEmailMap.entrySet()) {
            List<UserDTO> list = entry.getValue();
            distinctNameAndEmail.add(list.get(0));
            if (list.size() > 1) {
                for (int i = 1; i < list.size(); i++) {
                    ErrorUserDTO dto = getErrorUserDTO(list.get(i), "Excel中存在重复的登录名和邮箱");
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
            hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap, errorUsers, "error users", ErrorUserDTO.class);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            logger.error("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.export", e);
        }
        return upload(hssfWorkbook, "errorUser.xls", "error-user");
    }

    private String upload(HSSFWorkbook hssfWorkbook, String originalFilename, String bucketName) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        String url;
        try {
            hssfWorkbook.write(bos);
            MockMultipartFile multipartFile =
                    new MockMultipartFile("file", originalFilename, "application/vnd.ms-excel", bos.toByteArray());
            url = fileFeignClient.uploadFile(bucketName, multipartFile.getOriginalFilename(), multipartFile).getBody();
        } catch (IOException e) {
            logger.error("HSSFWorkbook to ByteArrayOutputStream failed, exception: {}", e.getMessage());
            throw new CommonException("error.byteArrayOutputStream", e);
        } catch (Exception e) {
            logger.error("feign invoke exception : {}", e.getMessage());
            throw new CommonException("error.feign.invoke", e);
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
            hssfWorkbook = ExcelExportHelper.exportExcel2003(propertyMap, errorMemberRoles, "error", ExcelMemberRoleDTO.class);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            logger.error("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.export");
        }
        return upload(hssfWorkbook, "errorMemberRole.xls", "error-member-role");
    }

    private void processUsers(UserDTO user, List<ErrorUserDTO> errorUsers, List<UserDTO> validateUsers) {
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

    private Boolean validateUsers(UserDTO user, List<ErrorUserDTO> errorUsers, List<UserDTO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        String realName = user.getRealName();
        String phone = user.getPhone();
        String password = user.getPassword();
        Boolean ok = false;
        if (StringUtils.isEmpty(realName)) {
            realName = loginName;
            user.setRealName(loginName);
        }
        if (StringUtils.isEmpty(loginName) || StringUtils.isEmpty(email)) {
            //乐观认为大多数是正确的，所以new 对象放到了if 里面
            errorUsers.add(getErrorUserDTO(user, "登录名或邮箱为空"));
        } else if (!Pattern.matches(UserDTO.LOGIN_NAME_REG, loginName)) {
            errorUsers.add(getErrorUserDTO(user, "登录名只能使用字母和数字，长度在1-32位之间"));
        } else if (loginName.length() > 32 || realName.length() > 32) {
            errorUsers.add(getErrorUserDTO(user, "登录名或用户名超过32位"));
        } else if (!Pattern.matches(UserDTO.EMAIL_REG, email)) {
            errorUsers.add(getErrorUserDTO(user, "非法的邮箱格式"));
        } else if (!StringUtils.isEmpty(phone) && !Pattern.matches(UserDTO.PHONE_REG, phone)) {
            errorUsers.add(getErrorUserDTO(user, "手机号格式不正确"));
        } else if (password != null && !userPasswordValidator.validate(password, user.getOrganizationId(), false)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            String cause = "用户密码长度不符合系统设置中的范围";
            // 为了获取报错的密码长度，再进行一次校验，从Exception中拿到报错信息，乐观认为犯错是少数，所以这样处理
            try {
                userPasswordValidator.validate(password, user.getOrganizationId(), true);
            } catch (CommonException c) {
                if (c.getParameters().length >= 2) {
                    cause += "，长度应为" + c.getParameters()[0] + "-" + c.getParameters()[1];
                }
            }
            errorUser.setCause(cause);
            errorUsers.add(errorUser);
        } else {
            ok = true;
            setUserField(user);
            insertUsers.add(user);
        }
        return ok;
    }

    private void setUserField(UserDTO user) {
        user.setLoginName(user.getLoginName().trim());
        if (!StringUtils.isEmpty(user.getRealName())) {
            user.setRealName(user.getRealName().trim());
        }
        user.setEmail(user.getEmail().trim());
        if (!StringUtils.isEmpty(user.getPhone())) {
            user.setPhone(user.getPhone().trim());
        }
        if (!StringUtils.isEmpty(user.getPassword())) {
            user.setPassword(user.getPassword().trim());
        }
    }

    private ErrorUserDTO getErrorUserDTO(final UserDTO user, final String cause) {
        ErrorUserDTO errorUser = new ErrorUserDTO();
        BeanUtils.copyProperties(user, errorUser);
        errorUser.setCause(cause);
        return errorUser;
    }


    public interface FinishFallback {
        /**
         * 同步完成后回调
         *
         * @param uploadHistoryDTO 历史纪录
         */
        void callback(UploadHistoryDTO uploadHistoryDTO);
    }


    @Component
    public class FinishFallbackImpl implements FinishFallback {

        private UploadHistoryMapper uploadHistoryMapper;

        public FinishFallbackImpl(UploadHistoryMapper uploadHistoryMapper) {
            this.uploadHistoryMapper = uploadHistoryMapper;
        }

        @Override
        public void callback(UploadHistoryDTO uploadHistoryDTO) {
            UploadHistoryDTO history = uploadHistoryMapper.selectByPrimaryKey(uploadHistoryDTO.getId());
            history.setEndTime(new Date((System.currentTimeMillis())));
            history.setSuccessfulCount(uploadHistoryDTO.getSuccessfulCount());
            history.setFailedCount(uploadHistoryDTO.getFailedCount());
            history.setUrl(uploadHistoryDTO.getUrl());
            history.setFinished(uploadHistoryDTO.getFinished());
            history.setSourceId(uploadHistoryDTO.getSourceId());
            history.setSourceType(uploadHistoryDTO.getSourceType());
            uploadHistoryMapper.updateByPrimaryKeySelective(history);
        }
    }
}
