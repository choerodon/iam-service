package io.choerodon.iam.app.service;

import io.choerodon.iam.infra.dto.RoleDTO;

/**
 * @author superlee
 * @since 2019-04-15
 */
public interface RoleService {

    /**
     * 创建角色
     * @param roleDTO
     * @return
     */
    RoleDTO create(RoleDTO roleDTO);
}
