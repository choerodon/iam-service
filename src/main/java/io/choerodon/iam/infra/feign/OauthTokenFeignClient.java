package io.choerodon.iam.infra.feign;

import java.util.List;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import io.choerodon.iam.infra.feign.fallback.OauthTokenFeignClientFallback;

/**
 * @author zmf
 */
@FeignClient(value = "oauth-server", path = "/oauth/v1/token_manager", fallback = OauthTokenFeignClientFallback.class)
public interface OauthTokenFeignClient {
    /**
     * 根据loginName删除token
     *
     * @param loginName 登录名
     */
    @DeleteMapping("/all")
    void deleteTokens(@RequestParam(value = "loginName") String loginName);

    /**
     * 根据 tokenId 删除 token
     *
     * @param tokenId tokenId
     */
    @DeleteMapping("/one")
    void deleteToken(@RequestParam(value = "tokenId") String tokenId);

    /**
     * 根据 tokenList删除 token
     *
     * @param tokenIdList tokenIdList
     */
    @DeleteMapping("/list")
    void deleteTokenList(@RequestBody List<String> tokenIdList);
}
