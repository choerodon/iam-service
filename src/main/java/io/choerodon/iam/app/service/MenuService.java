package io.choerodon.iam.app.service;


import io.choerodon.iam.infra.dto.MenuDTO;

import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 * @date 2018-04-10
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
     * 根据id删除菜单，只能删除非默认的菜单
     *
     * @param id
     * @return
     */
    void delete(Long id);


    void check(MenuDTO menu);

    /**
     * 查询当前登录用户可以查看的菜单
     *
     * @param code 顶级菜单的code
     * @param sourceId site和user为0，project和organization是对应的id
     * @return
     */
    MenuDTO menus(String code, Long sourceId);

    /**
     * 菜单配置界面根据层级查询树形菜单，菜单下包含权限信息
     *
     * @param code
     * @param sourceId
     * @return
     */
    MenuDTO menuConfig(String code, Long sourceId);

    /**
     * 根据前端传入的树形菜单，更新后端的树形结构
     *
     * @param code
     * @param menus
     */
    void saveMenuConfig(String code, List<MenuDTO> menus);

    /**
     * 查询所有菜单
     * @return
     */
    List<MenuDTO> list();

}
