package io.choerodon.iam.infra.feign.fallback;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;

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

    @Override
    public void deleteToken(String tokenId) {
        throw new CommonException(TOKEN_DELETE_ERROR, tokenId);
    }


    @Override
    public void deleteTokenList(List<String> tokenIdList) {
        throw new CommonException(TOKEN_DELETE_ERROR, tokenIdList);
    }
}