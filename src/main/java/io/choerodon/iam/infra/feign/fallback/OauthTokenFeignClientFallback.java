package io.choerodon.iam.infra.feign.fallback;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;
import org.springframework.stereotype.Component;

/**
 * @author zmf
 */
@Component
public class OauthTokenFeignClientFallback implements OauthTokenFeignClient {
    private static final String TOKEN_DELETE_ERROR = "error.delete.tokens";

    @Override
    public void deleteTokens(String loginName) {
        throw new CommonException(TOKEN_DELETE_ERROR, loginName);
    }
}
