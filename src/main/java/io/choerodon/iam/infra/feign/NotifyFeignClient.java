package io.choerodon.iam.infra.feign;

import javax.validation.Valid;

import io.choerodon.core.notify.NoticeSendDTO;
import io.choerodon.iam.api.dto.SystemAnnouncementDTO;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import io.choerodon.iam.infra.feign.fallback.NotifyFeignClientFallback;

@FeignClient(value = "notify-service", path = "/v1", fallback = NotifyFeignClientFallback.class)
public interface NotifyFeignClient {

    @PostMapping("/notices")
    void postNotice(@RequestBody @Valid NoticeSendDTO dto);

    @PostMapping("/announcements")
    ResponseEntity<SystemAnnouncementDTO> create(@RequestBody @Validated SystemAnnouncementDTO dto);
}