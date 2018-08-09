package io.choerodon.iam.infra.feign.fallback;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.FileDTO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author superlee
 */
@Component
public class FileFeignClientFallback implements FileFeignClient {

    private static final String MSG_ERROR_UPLOAD = "error.file.upload";

    @Override
    public ResponseEntity<String> uploadFile(String bucketName, String fileName, MultipartFile multipartFile) {
        throw new CommonException(MSG_ERROR_UPLOAD);
    }

    @Override
    public ResponseEntity<FileDTO> upload(String bucketName, String fileName, MultipartFile multipartFile) {
        throw new CommonException(MSG_ERROR_UPLOAD);
    }
}
