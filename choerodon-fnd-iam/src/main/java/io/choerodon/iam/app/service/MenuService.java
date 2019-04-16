package io.choerodon.iam.app.service;

import io.choerodon.iam.infra.dto.MenuDTO;

import java.util.List;

/**
 * @author superlee
 * @since 2019-04-15
 */
public interface MenuService {
    /**
     * 根据id查询菜单
     *
     * @param id
     * @return
     */
    MenuDTO query(Long id);

    /**
     * 新建菜单
     *
     * @param menuDTO
     * @return
     */
    MenuDTO create(MenuDTO menuDTO);

    /**
     * 更新菜单
     *
     * @param id
     * @param menuDTO
     * @return
     */
    MenuDTO update(Long id, MenuDTO menuDTO);

    /**
     * 查询当前登录用户可以查看的菜单
     *
     * @param level
     * @param sourceId
     * @return
     */
    List<MenuDTO> menus(String level, Long sourceId);

    /**
     * menuConfig界面根据层级查询树形菜单，菜单下包含权限信息
     *
     * @param code
     * @return
     */
    MenuDTO menuConfig(String code, String level, String type);

    /**
     * 根据前端传入的树形菜单，更新后端的树形结构
     *
     * @param level
     * @param menus
     */
    void saveMenuConfig(String level, List<MenuDTO> menus);
}
