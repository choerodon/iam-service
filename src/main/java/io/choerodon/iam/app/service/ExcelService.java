package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.UploadHistoryDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author superlee
 */
public interface ExcelService {
    UploadHistoryDTO importUsers(Long id, MultipartFile multipartFile);

    Resource getUserTemplates();

    HttpHeaders getHttpHeaders();

//    void export();
}
