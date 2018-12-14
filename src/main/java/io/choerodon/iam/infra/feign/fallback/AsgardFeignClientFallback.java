package io.choerodon.iam.infra.feign.fallback;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.feign.AsgardFeignClient;

/**
 * @author dengyouquan
 **/
@Component
public class AsgardFeignClientFallback implements AsgardFeignClient {
    @Override
    public void disableOrg(long orgId) {
        throw new CommonException("error.asgard.quartzTask.disableOrg");
    }

    @Override
    public void disableProj(long projectId) {
        throw new CommonException("error.asgard.quartzTask.disableProject");
    }
}
