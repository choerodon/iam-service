package io.choerodon.iam.infra.feign.fallback;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.feign.AsgardFeignClient;
import org.springframework.stereotype.Component;

/**
 * @author dengyouquan
 **/
@Component
public class AsgardFeignClientFallback implements AsgardFeignClient {
    @Override
    public void disable(long orgId) {
        throw new CommonException("error.asgard.quartzTask.disable");
    }
}
