package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.AccessTokenDTO;

/**
 * @author Eugen
 **/
public interface AccessTokenService {
    /**
     * 根据用户Id查询用户下所有生效的token
     *
     * @return Token列表
     */
    Page<AccessTokenDTO> pagingTokensByUserIdAndClient(int page, int size, String clientName, String currentToken);

    /**
     * 手动失效用户已存在的token
     *
     * @param tokenId      tokenId
     * @param currentToken 当前token
     */
    void delete(String tokenId, String currentToken);

    /**
     * 批量失效用户的token
     *
     * @param tokenIds     token列表
     * @param currentToken 当前token
     */
    void deleteList(List<String> tokenIds, String currentToken);

    /**
     * 删除所有过期的token
     */
    void deleteAllExpiredToken(Map<String, Object> map);
}
