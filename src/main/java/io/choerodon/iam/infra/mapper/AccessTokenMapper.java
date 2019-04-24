package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.AccessTokenDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;


/**
 * @author Eugen
 */
public interface AccessTokenMapper extends Mapper<AccessTokenDTO> {

    List<AccessTokenDTO> selectTokens(@Param("userName") String userName,
                                        @Param("clientId") String clientId);


    List<AccessTokenDTO> selectTokenList(@Param("tokenIds") List<String> tokenIds);
}
