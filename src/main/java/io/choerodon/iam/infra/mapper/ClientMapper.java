package io.choerodon.iam.infra.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;

import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface ClientMapper extends BaseMapper<ClientDO> {

    /**
     * 分页模糊查询客户端
     *
     * @param clientDO 客户端对象
     * @param params   客户端模糊查询参数
     * @return 客户端集合
     */
    List<ClientDO> fulltextSearch(@Param("clientDO") ClientDO clientDO,
                                  @Param("params") String[] params);
}
