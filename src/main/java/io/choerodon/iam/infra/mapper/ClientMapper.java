package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface ClientMapper extends BaseMapper<ClientDO> {

    List<ClientDO> fulltextSearch(@Param("clientDO") ClientDO clientDO,
                                  @Param("params") String[] params);
}
