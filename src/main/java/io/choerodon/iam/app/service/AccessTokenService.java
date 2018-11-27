package io.choerodon.iam.app.service;

import java.util.Map;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.UserAccessTokenDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author Eugen
 **/
public interface AccessTokenService {
    /**
     * 根据用户Id查询用户下所有生效的token
     *
     * @param userId userId
     * @return Token列表
     */
    Page<UserAccessTokenDTO> pagingTokensByUserIdAndClient(PageRequest pageRequest, Long userId, String clientName, String currentToken);

    /**
     * 手动失效用户已存在的token
     *
     * @param tokenId tokenId
     */
    void delete(String tokenId, String currentToken);


    /**
     * 删除所有过期的token
     */
    void deleteAllExpiredToken(Map<String, Object> map);
}
