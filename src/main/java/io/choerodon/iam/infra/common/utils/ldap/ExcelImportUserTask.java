package io.choerodon.iam.infra.common.utils.ldap;

import io.choerodon.core.excel.ExcelExportHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ErrorUserDTO;
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
        List<UserDO> insertUsers = new ArrayList<>();
        List<ErrorUserDTO> errorUsers = new ArrayList<>();
        users.forEach(u -> {
            u.setOrganizationId(organizationId);
            processUsers(u, errorUsers, insertUsers);
        });
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
            url = exportAndUpload(errorUsers);
        }
        //插入uploadHistory
        uploadHistoryDO.setSuccessfulCount(successCount);
        uploadHistoryDO.setFailedCount(failCount);
        uploadHistoryDO.setUrl(url);
        fallback.callback(uploadHistoryDO);
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
            logger.info("something wrong was happened when exporting the excel, exception : {}", e.getMessage());
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
            logger.info("HSSFWorkbook to ByteArrayOutputStream failed, exception: {}", e.getMessage());
            throw new CommonException("error.byteArrayOutputStream");
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
        String loginName = user.getLoginName();
        String email = user.getEmail();
        if (loginNameIsExisted(loginName)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("登录名已存在");
            errorUsers.add(errorUser);
        } else if (emailIsExisted(email)) {
            ErrorUserDTO errorUser = new ErrorUserDTO();
            BeanUtils.copyProperties(user, errorUser);
            errorUser.setCause("邮箱已存在");
            errorUsers.add(errorUser);
        } else {
            insertUsers.add(user);
        }
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
            uploadHistoryMapper.updateByPrimaryKeySelective(history);
        }
    }
}
