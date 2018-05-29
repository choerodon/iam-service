package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.iam.entity.RolePermissionE;

import java.util.List;

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
