package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.excel.ExcelReadHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.BatchImportResultDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.ExcelService;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.common.utils.ListUtils;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author superlee
 */
@Service
public class ExcelServiceImpl implements ExcelService {

    private final Logger logger = LoggerFactory.getLogger(ExcelServiceImpl.class);

    private OrganizationUserService organizationUserService;

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private UserRepository userRepository;


    public ExcelServiceImpl(OrganizationUserService organizationUserService,
                            UserRepository userRepository) {
        this.organizationUserService = organizationUserService;
        this.userRepository = userRepository;
    }

    @Override
    public BatchImportResultDTO importUsers(Long id, MultipartFile multipartFile) {
        BatchImportResultDTO batchImportResult = new BatchImportResultDTO();
        batchImportResult.setSuccess(0);
        batchImportResult.setFailed(0);
        batchImportResult.setFailedUsers(new ArrayList<>());
        List<UserDO> insertUsers = new ArrayList<>();
        try {
            List<UserDO> users = ExcelReadHelper.read(multipartFile, UserDO.class, null);
            users.forEach(u -> {
                u.setOrganizationId(id);
                processUsers(u, batchImportResult, insertUsers);
            });
        } catch (IOException | IllegalAccessException | InstantiationException | InvocationTargetException e) {
            logger.info("something wrong was happened when reading the excel, exception : {}", e.getMessage());
            throw new CommonException("error.excel.read");
        }
        List<List<UserDO>> list = ListUtils.subList(insertUsers, 1000);
        list.forEach(l -> {
            if (!l.isEmpty()) {
                organizationUserService.batchCreateUsers(l);
            }
        });
        return batchImportResult;
    }

    @Override
    public Resource getUserTemplates() {
        InputStream inputStream = this.getClass().getResourceAsStream("/templates/userTemplates.xlsx");
        return new InputStreamResource(inputStream);
    }

    @Override
    public HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
        headers.add("charset", "utf-8");
        //设置下载文件名
        String filename = null;
        try {
            filename = URLEncoder.encode("用户导入模版.xlsx", "UTF-8");
        } catch (UnsupportedEncodingException e) {
            logger.info("url encodes exception: {}", e.getMessage());
            throw new CommonException("error.encode.url");
        }
        headers.add("Content-Disposition", "attachment;filename=\"" + filename + "\"");
        return headers;
    }

    private void processUsers(UserDO user, BatchImportResultDTO batchImportResult, List<UserDO> insertUsers) {
        String loginName = user.getLoginName();
        String email = user.getEmail();
        if (loginNameIsExisted(loginName)) {
            batchImportResult.failedIncrement();
            batchImportResult.getFailedUsers().add(ConvertHelper.convert(user, UserDTO.class));
        } else if (emailIsExisted(email)) {
            batchImportResult.failedIncrement();
            batchImportResult.getFailedUsers().add(ConvertHelper.convert(user, UserDTO.class));
        } else {
            batchImportResult.successIncrement();
            insertUsers.add(user);
        }
        //excel中用户密码为空，设置默认密码为000000
        if (StringUtils.isEmpty(user.getPassword())) {
            user.setPassword("000000");
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
}
