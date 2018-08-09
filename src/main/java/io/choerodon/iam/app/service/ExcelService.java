package io.choerodon.iam.app.service;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author superlee
 */
public interface ExcelService {
    void importUsers(Long id, MultipartFile multipartFile);

    Resource getUserTemplates();

    HttpHeaders getHttpHeaders();

}
