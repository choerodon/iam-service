package io.choerodon.iam.app.service.impl;

import io.choerodon.core.excel.ExcelReadConfig;
import io.choerodon.core.excel.ExcelReadHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.app.service.ExcelService;
import io.choerodon.iam.domain.repository.UploadHistoryRepository;
import io.choerodon.iam.infra.common.utils.excel.ExcelImportUserTask;
import io.choerodon.iam.infra.dataobject.UploadHistoryDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author superlee
 */
@Service
public class ExcelServiceImpl implements ExcelService {

    private final Logger logger = LoggerFactory.getLogger(ExcelServiceImpl.class);

    private UploadHistoryRepository uploadHistoryRepository;

    private ExcelImportUserTask excelImportUserTask;
    private ExcelImportUserTask.FinishFallback finishFallback;

    public ExcelServiceImpl(UploadHistoryRepository uploadHistoryRepository,
                            ExcelImportUserTask excelImportUserTask,
                            ExcelImportUserTask.FinishFallback finishFallback) {
        this.uploadHistoryRepository = uploadHistoryRepository;
        this.excelImportUserTask = excelImportUserTask;
        this.finishFallback = finishFallback;
    }

    @Override
    public void importUsers(Long organizationId, MultipartFile multipartFile) {
        ExcelReadConfig excelReadConfig = initExcelReadConfig();
        long begin = System.currentTimeMillis();
        try {
            List<UserDO> users = ExcelReadHelper.read(multipartFile, UserDO.class, excelReadConfig);
            if (users.isEmpty()) {
                throw new CommonException("error.excel.user.empty");
            }
            UploadHistoryDO uploadHistory = initUploadHistory(organizationId);
            long end = System.currentTimeMillis();
            logger.info("read excel for {} millisecond", (end - begin));
            Long userId = DetailsHelper.getUserDetails().getUserId();
            excelImportUserTask.importUsers(userId, users, organizationId, uploadHistory, finishFallback);
        } catch (IOException | IllegalAccessException | InstantiationException | InvocationTargetException e) {
            throw new CommonException("error.excel.read", e.getCause());
        } catch (IllegalArgumentException e) {
            throw new CommonException("error.excel.illegal.column", e);
        }
    }

    private UploadHistoryDO initUploadHistory(Long organizationId) {
        UploadHistoryDO uploadHistory = new UploadHistoryDO();
        uploadHistory.setBeginTime(new Date(System.currentTimeMillis()));
        uploadHistory.setType("user");
        uploadHistory.setUserId(DetailsHelper.getUserDetails().getUserId());
        uploadHistory.setSourceId(organizationId);
        uploadHistory.setSourceType(ResourceLevel.ORGANIZATION.value());
        uploadHistoryRepository.insertSelective(uploadHistory);
        return uploadHistory;
    }

    private ExcelReadConfig initExcelReadConfig() {
        ExcelReadConfig excelReadConfig = new ExcelReadConfig();
        String[] skipSheetNames = {"readme"};
        Map<String, String> propertyMap = new HashMap<>();
        propertyMap.put("登录名*", "loginName");
        propertyMap.put("用户名*", "realName");
        propertyMap.put("邮箱*", "email");
        propertyMap.put("密码", "password");
        propertyMap.put("手机号", "phone");
        excelReadConfig.setSkipSheetNames(skipSheetNames);
        excelReadConfig.setPropertyMap(propertyMap);
        return excelReadConfig;
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
}
