package io.choerodon.iam.infra.feign.fallback;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.WsSendDTO;
import io.choerodon.iam.infra.feign.NotifyFeignClient;


@Component
public class NotifyFeignClientFallback implements NotifyFeignClient {

    private static final String FEIGN_ERROR = "notify.error";

    @Override
    public void postPm(WsSendDTO dto) {
        throw new CommonException(FEIGN_ERROR);
    }
}
