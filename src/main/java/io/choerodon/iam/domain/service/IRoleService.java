package io.choerodon.iam.domain.service;

import io.choerodon.iam.infra.dto.RoleDTO;

/**
 * @author superlee
 */
public interface IRoleService {

    RoleDTO create(RoleDTO roleDTO);

    RoleDTO update(RoleDTO roleDTO);

    void deleteByPrimaryKey(Long id);

    RoleDTO updateRoleEnabled(Long id);

    RoleDTO updateRoleDisabled(Long id);
}
