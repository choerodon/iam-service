package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.iam.entity.MenuE;
import io.choerodon.iam.infra.dataobject.MenuDO;

import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 */
public interface MenuRepository {

    MenuE queryById(Long menuId);

    MenuE createMenu(MenuE menuE);

    MenuE updateMenu(MenuE menuE);

    Boolean deleteMenu(Long menuId);

    void deleteMenusById(List<Long> menuIds);

    List<MenuDO> selectByLevel(String level);

    List<MenuDO> queryMenusWithPermissions(String level, String type);

    List<MenuDO> queryMenusWithPermissionByTestPermission(String level, String memberType, Long memberId,
                                                          String sourceType, Long sourceId);
    List<MenuDO> select(MenuDO menuDO);
}
