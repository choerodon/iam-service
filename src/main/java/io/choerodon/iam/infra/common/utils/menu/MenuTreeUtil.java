package io.choerodon.iam.infra.common.utils.menu;

import io.choerodon.iam.api.dto.MenuDTO;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 递归解析菜单列表为菜单树的形式
 *
 * @author wuguokai
 */
public class MenuTreeUtil {

    private MenuTreeUtil() {
    }

    //将菜单格式化成树形
    public static List<MenuDTO> formatMenu(List<MenuDTO> entryList) {
        List<MenuDTO> displayMenus = new ArrayList<>();
        for (MenuDTO menuDTO : entryList) {
            if ((menuDTO.getParentId() == null || menuDTO.getParentId() == 0)
                    && ("root".equals(menuDTO.getType()) || "dir".equals(menuDTO.getType()))) {
                menuDTO.setSubMenus(processMenu(menuDTO.getId(), entryList));
                displayMenus.add(menuDTO);
            }
        }
        if (!displayMenus.isEmpty()) {
            return sortMenu(displayMenus);
        }
        return displayMenus;
    }

    //递归将菜单格式化成树形
    private static List<MenuDTO> processMenu(Long id, List<MenuDTO> menus) {
        List<MenuDTO> subMenus = null;
        for (MenuDTO menu : menus) {
            if (menu.getParentId().equals(id)) {
                if (subMenus == null) {
                    subMenus = new ArrayList<>();
                }
                menu.setSubMenus(processMenu(menu.getId(), menus));
                subMenus.add(menu);
            }
        }
        if (subMenus != null) {
            return sortMenu(subMenus);
        }
        return subMenus;
    }

    private static List<MenuDTO> sortMenu(List<MenuDTO> entryList) {
        Collections.sort(entryList, (MenuDTO m1, MenuDTO m2) -> {
            if (m1.getSort() == null) {
                return -1;
            }
            if (m2.getSort() == null || m1.getSort() > m2.getSort()) {
                return 1;
            }
            if (m1.getSort().equals(m2.getSort())) {
                return 0;
            }
            return -1;
        });
        return entryList;
    }
}
