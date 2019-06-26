package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface RoleMapper extends Mapper<RoleDTO> {

    List<Long> queryRoleByUser(@Param("userId") Long userId,
                               @Param("sourceType") String sourceType,
                               @Param("sourceId") Long sourceId);

    List<RoleDTO> queryRolesInfoByUser(@Param("sourceType") String sourceType,
                                      @Param("sourceId") Long sourceId,
                                      @Param("userId") Long userId);

    List<RoleDTO> fulltextSearch(@Param("roleQuery") RoleQuery roleQuery, @Param("param") String param);

    RoleDTO selectRoleWithPermissionsAndLabels(Long id);

    int rolesLevelCount(@Param("roleIds") List<Long> roleIds);

    List<RoleDTO> selectRolesByLabelNameAndType(@Param("name") String name, @Param("type") String type);

    List<RoleDTO> selectInitRolesByPermissionId(Long permissionId);

//    Set<String> matchCode(@Param("codeSet") Set<String> codeSet);

//    List<RoleDTO> queryRoleByOrgId(@Param("orgId") Long orgId);

    List<RoleDTO> fuzzySearchRolesByName(@Param("roleName") String roleName, @Param("sourceType") String sourceType);
}
