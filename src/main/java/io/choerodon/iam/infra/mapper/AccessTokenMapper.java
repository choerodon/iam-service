package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.domain.oauth.entity.UserAccessTokenE;
import io.choerodon.iam.infra.dataobject.AccessTokenDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author Eugen
 */
public interface AccessTokenMapper extends BaseMapper<AccessTokenDO> {

    List<UserAccessTokenE> selectTokens(@Param("userName") String userName,
                                        @Param("clientId") String clientId);


    List<AccessTokenDO> selectTokenList(@Param("tokenIds") List<String> tokenIds);
}
