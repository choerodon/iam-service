package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.ClientWithRoleDTO;
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
     * @param param    客户端模糊查询参数
     * @return 客户端集合
     */
    List<ClientDO> fulltextSearch(@Param("clientDO") ClientDO clientDO,
                                  @Param("param") String param);

    Integer selectClientCountFromMemberRoleByOptions(
            @Param("roleId") Long roleId,
            @Param("sourceType") String sourceType,
            @Param("sourceId") Long sourceId,
            @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
            @Param("param") String param);

    List<ClientWithRoleDTO> selectClientsByRoleIdAndOptions(
            @Param("roleId") Long roleId,
            @Param("sourceId") Long sourceId,
            @Param("sourceType") String sourceType,
            @Param("clientRoleSearchDTO") ClientRoleSearchDTO clientRoleSearchDTO,
            @Param("param") String param);
}
