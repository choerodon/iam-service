package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.MenuDTO;

import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 * @date 2018-04-10
 */
public interface MenuService {
    MenuDTO query(Long menuId);

    MenuDTO create(MenuDTO menuDTO);

    MenuDTO update(Long menuId, MenuDTO menuDTO);

    Boolean delete(Long menuId);

    List<MenuDTO> list(String level);

    List<MenuDTO> saveListTree(String level, List<MenuDTO> menuDTOList);

    List<MenuDTO> queryMenusWithPermissions(String level, String type);

    List<MenuDTO> listAfterTestPermission(String level, Long sourceId);

    List<MenuDTO> listTreeMenusWithPermissions(Boolean testPermission, String level);
}
