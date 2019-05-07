package io.choerodon.iam.infra.repository.impl;

import io.choerodon.iam.domain.repository.MenuPermissionRepository;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.mapper.MenuPermissionMapper;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class MenuPermissionRepositoryImpl implements MenuPermissionRepository {

    private MenuPermissionMapper menuPermissionMapper;

    public MenuPermissionRepositoryImpl (MenuPermissionMapper menuPermissionMapper) {
        this.menuPermissionMapper = menuPermissionMapper;
    }

    @Override
    public void delete(MenuPermissionDTO menuPermissionDTO) {
        menuPermissionMapper.delete(menuPermissionDTO);
    }
}
