package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.BatchImportResultDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author superlee
 */
public interface ExcelService {
    BatchImportResultDTO importUsers(Long id, MultipartFile multipartFile);

    Resource getUserTemplates();

    HttpHeaders getHttpHeaders();
}
