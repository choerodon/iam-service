package io.choerodon.iam.app.service;

import io.choerodon.iam.infra.dto.MenuDTO;

/**
 * @author superlee
 * @since 2019-04-15
 */
public interface MenuService {
    /**
     * 根据id查询菜单
     * @param id
     * @return
     */
    MenuDTO query(Long id);

    /**
     * 新建菜单
     * @param menuDTO
     * @return
     */
    MenuDTO create(MenuDTO menuDTO);
}
