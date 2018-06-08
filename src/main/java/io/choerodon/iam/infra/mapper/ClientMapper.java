package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author wuguokai
 */
public interface ClientMapper extends BaseMapper<ClientDO> {

    /**
     * 分页模糊查询客户端
     *
     * @param clientDO 客户端对象
     * @param param   客户端模糊查询参数
     * @return 客户端集合
     */
    List<ClientDO> fulltextSearch(@Param("clientDO") ClientDO clientDO,
                                  @Param("param") String param);
}
