package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface RoleMapper extends BaseMapper<RoleDO> {

    List<Long> queryRoleByUser(@Param("userId") Long userId,
                               @Param("sourceType") String sourceType,
                               @Param("sourceId") Long sourceId);

    List<RoleDO> queryRolesInfoByUser(@Param("sourceType") String sourceType,
                                    @Param("sourceId") Long sourceId,
                                    @Param("userId") Long userId);

    List<RoleDO> fulltextSearch(@Param("roleDO") RoleDO roleDO, @Param("param") String param);

    RoleDO selectRoleWithPermissionsAndLabels(Long id);

    int rolesLevelCount(@Param("roleIds") List<Long> roleIds);

    List<RoleDO> selectRolesByLabelNameAndType(@Param("name") String name, @Param("type") String type);

    List<RoleDO> selectInitRolesByPermissionId(Long permissionId);

    Set<String> matchCode(@Param("codeSet") Set<String> codeSet);

    List<RoleDO> queryRoleByOrgId(@Param("orgId") Long orgId);
}
