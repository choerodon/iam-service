package io.choerodon.iam.infra.feign;

import javax.validation.Valid;

import io.choerodon.core.notify.NoticeSendDTO;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import io.choerodon.iam.infra.feign.fallback.NotifyFeignClientFallback;

@FeignClient(value = "notify-service", path = "/v1/notices", fallback = NotifyFeignClientFallback.class)
public interface NotifyFeignClient {

    @PostMapping
    void postNotice(@RequestBody @Valid NoticeSendDTO dto);

}