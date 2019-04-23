package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.RolePermissionDTO;

import java.util.List;

/**
 * @author wuguokai
 */
public interface RolePermissionRepository {
    RolePermissionDTO selectOne(RolePermissionDTO rolePermissionDTO);

    RolePermissionDTO insert(RolePermissionDTO rolePermissionDTO);

    void delete(RolePermissionDTO rolePermissionDTO);

    List<RolePermissionDTO> select(RolePermissionDTO rolePermissionDTO);

    List<Long> queryExistingPermissionIdsByRoleIds(List<Long> roles);

    void insertList(List<RolePermissionDTO> rolePermissionDOList);
}
