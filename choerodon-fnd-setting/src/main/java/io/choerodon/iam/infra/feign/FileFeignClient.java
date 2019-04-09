package io.choerodon.iam.infra.feign;

import io.choerodon.iam.api.dto.FileDTO;
import io.choerodon.iam.infra.config.MultipartSupportConfig;
import io.choerodon.iam.infra.feign.fallback.FileFeignClientFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author superlee
 */
@FeignClient(value = "file-service",
        configuration = MultipartSupportConfig.class,
        fallback = FileFeignClientFallback.class)
public interface FileFeignClient {

    @PostMapping(
            value = "/v1/files",
            produces = {MediaType.APPLICATION_JSON_UTF8_VALUE},
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<String> uploadFile(@RequestParam("bucket_name") String bucketName,
                                      @RequestParam("file_name") String fileName,
                                      @RequestPart("file") MultipartFile multipartFile);

    @PostMapping(
            value = "/v1/documents",
            produces = {MediaType.APPLICATION_JSON_UTF8_VALUE},
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<FileDTO> upload(@RequestParam("bucket_name") String bucketName,
                                   @RequestParam("file_name") String fileName,
                                   @RequestPart("file") MultipartFile multipartFile);
}
