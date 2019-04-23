package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.MenuPermissionDTO;

/**
 * @author wuguokai
 */
public interface MenuPermissionRepository {
    void delete(MenuPermissionDTO menuPermissionDTO);
}
