package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.iam.domain.iam.entity.RolePermissionE;

/**
 * @author wuguokai
 */
public interface RolePermissionRepository {
    RolePermissionE selectOne(RolePermissionE rolePermissionE);

    RolePermissionE insert(RolePermissionE rolePermissionE);

    void delete(RolePermissionE rolePermissionE);

    List<RolePermissionE> select(RolePermissionE rolePermissionE);

    List<Long> queryPermissionIdsByRoles(List<Long> roles);
}
