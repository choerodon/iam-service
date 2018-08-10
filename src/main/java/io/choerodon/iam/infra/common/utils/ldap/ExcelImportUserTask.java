package io.choerodon.iam.infra.common.utils.ldap;

import io.choerodon.core.excel.ExcelExportHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ErrorUserDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.common.utils.MockMultipartFile;
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
import java.util.regex.Pattern;
import java.util.stream.Collectors;


/**
 * @author wuguokai
 */
@RefreshScope
@Component
public class ExcelImportUserTask {
    private static final Logger logger = LoggerFactory.getLogger(ExcelImportUserTask.class);

    private UserRepository userRepository;
    private OrganizationUserService organizationUserService;
    private FileFeignClient fileFeignClient;
    private final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();


    public ExcelImportUserTask(UserRepository userRepository,
                               OrganizationUserService organizationUserService,
                               FileFeignClient fileFeignClient) {
        this.userRepository = userRepository;
        this.organizationUserService = organizationUserService;
        this.fileFeignClient = fileFeignClient;
    }

    @Async("excel-executor")
    public void importUsers(List<UserDO> users, Long organizationId, UploadHistoryDO uploadHistoryDO, FinishFallback fallback) {
        logger.info("### begin to import users from excel, total size : {}", users.size());
        List<UserDO> insertUsers = new ArrayList<>();
        List<ErrorUserDTO> errorUsers = new ArrayList<>();
        //根据loginName和emai去重，返回
        List<UserDO> distinctUsers = distinct(users, errorUsers);
        long begin = System.currentTimeMillis();
        distinctUsers.forEach(u -> {
            u.setOrganizationId(organizationId);
            processUsers(u, errorUsers, insertUsers);
        });
        long end = System.currentTimeMillis();
        logger.info("process user for {} seconds", (end - begin) / 1000);
        List<List<UserDO>> list = ListUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
        Integer successCount = insertUsers.size();
        Integer failCount = errorUsers.size();
        String url = "";
        if (failCount > 0) {
            //失败的用户导出到excel
            try {
                long begin1 = System.currentTimeMillis();
                url = exportAndUpload(errorUsers);
                long end1 = System.currentTimeMillis();
                logger.info("export and upload file for {} seconds", (end1 - begin1) / 1000);
                uploadHistoryDO.setFinished(true);
            } catch (CommonException e) {
                uploadHistoryDO.setFinished(false);
                throw e;
            } finally {
                uploadHistoryDO.setSuccessfulCount(successCount);
                uploadHistoryDO.setFailedCount(failCount);
                uploadHistoryDO.setUrl(url);
                fallback.callback(uploadHistoryDO);
            }
        } else {
            //插入uploadHistory
            uploadHistoryDO.setSuccessfulCount(successCount);
            uploadHistoryDO.setFailedCount(failCount);
            uploadHistoryDO.setUrl(url);
            uploadHistoryDO.setFinished(true);
            fallback.callback(uploadHistoryDO);
        }
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
     * 去除loginName和email完全相同的对象
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
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        String url;
        try {
            hssfWorkbook.write(bos);
            MockMultipartFile multipartFile =
                    new MockMultipartFile("file","errorUser.xls","application/vnd.ms-excel", bos.toByteArray());
            url = fileFeignClient.uploadFile("error-user", multipartFile.getOriginalFilename(), multipartFile).getBody();
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

    private void processUsers(UserDO user, List<ErrorUserDTO> errorUsers, List<UserDO> insertUsers) {
        validateUsers(user, errorUsers, insertUsers);
        //excel中用户密码为空，设置默认密码为abcd1234
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

    private void validateUsers(UserDO user, List<ErrorUserDTO> errorUsers, List<UserDO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        ErrorUserDTO errorUser = new ErrorUserDTO();
        BeanUtils.copyProperties(user, errorUser);
        String realName = user.getRealName();
        String phone = user.getPhone();
        if (StringUtils.isEmpty(loginName) || StringUtils.isEmpty(email)) {
            errorUser.setCause("登录名或邮箱为空");
            errorUsers.add(errorUser);
        } else if (loginName.length() > 128) {
            errorUser.setCause("登陆名长度超过128位");
            errorUsers.add(errorUser);
        } else if (!Pattern.matches(UserDTO.EMAIL_REGULAR_EXPRESSION, email)) {
            errorUser.setCause("非法的邮箱格式");
            errorUsers.add(errorUser);
        } else if (!StringUtils.isEmpty(realName) && realName.length() > 32) {
            errorUser.setCause("用户名超过32位");
            errorUsers.add(errorUser);
        } else if (!StringUtils.isEmpty(phone) && !Pattern.matches(UserDTO.PHONE_REGULAR_EXPRESSION, phone)) {
            errorUser.setCause("手机号格式不正确");
            errorUsers.add(errorUser);
        } else if (loginNameIsExisted(loginName)) {
            errorUser.setCause("登录名已存在");
            errorUsers.add(errorUser);
        } else if (emailIsExisted(email)) {
            errorUser.setCause("邮箱已存在");
            errorUsers.add(errorUser);
        } else {
            insertUsers.add(user);
        }
    }

    private boolean emailIsExisted(String email) {
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        return userRepository.selectOne(userDO) != null;
    }

    private boolean loginNameIsExisted(String loginName) {
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        return userRepository.selectOne(userDO) != null;
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
            uploadHistoryMapper.updateByPrimaryKeySelective(history);
        }
    }
}
