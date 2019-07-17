package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.query.ClientRoleQuery;
import io.choerodon.iam.api.dto.SimplifiedClientDTO;

/**
 * @author wuguokai
 */
public interface ClientMapper extends Mapper<ClientDTO> {

    /**
     * 分页模糊查询客户端
     *
     * @param clientDTO 客户端对象
     * @param param    客户端模糊查询参数
     * @return 客户端集合
     */
    List<ClientDTO> fulltextSearch(@Param("clientDTO") ClientDTO clientDTO,
                                  @Param("param") String param);

    Integer selectClientCountFromMemberRoleByOptions(
            @Param("roleId") Long roleId,
            @Param("sourceType") String sourceType,
            @Param("sourceId") Long sourceId,
            @Param("clientRoleSearchDTO") ClientRoleQuery clientRoleSearchDTO,
            @Param("param") String param);

    List<ClientDTO> selectClientsByRoleIdAndOptions(
            @Param("roleId") Long roleId,
            @Param("sourceId") Long sourceId,
            @Param("sourceType") String sourceType,
            @Param("clientRoleSearchDTO") ClientRoleQuery clientRoleSearchDTO,
            @Param("param") String param);

    List<SimplifiedClientDTO> selectAllClientSimplifiedInfo(@Param("params") String params);

}
