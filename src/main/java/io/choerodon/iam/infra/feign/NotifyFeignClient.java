package io.choerodon.iam.infra.feign;

import javax.validation.Valid;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import io.choerodon.iam.api.dto.WsSendDTO;
import io.choerodon.iam.infra.feign.fallback.NotifyFeignClientFallback;

@FeignClient(value = "notify-service", path = "/v1/notices", fallback = NotifyFeignClientFallback.class)
public interface NotifyFeignClient {

    @PostMapping("/ws")
    void postPm(@RequestBody @Valid WsSendDTO dto);

}