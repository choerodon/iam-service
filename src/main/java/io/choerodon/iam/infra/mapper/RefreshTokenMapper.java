package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.AccessTokenDO;
import io.choerodon.iam.infra.dataobject.RefreshTokenDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author Eugen
 */
public interface RefreshTokenMapper extends BaseMapper<RefreshTokenDO> {
}
