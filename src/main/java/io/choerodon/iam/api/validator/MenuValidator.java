package io.choerodon.iam.api.validator;

import io.choerodon.base.enums.MenuType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.MenuDTO;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

/**
 * @author azengqiang
 */
public class MenuValidator {
    /**
     * 插入菜单校验.
     * 编码不能为空
     * 名称不能为空
     * 图标不能为空
     * 父级编码不能为空
     *
     * @param menu  菜单DTO
     * @param level 资源层级
     */
    public static void insertValidate(MenuDTO menu, String level) {
        menu.setResourceLevel(level);
        menu.setType(MenuType.MENU.value());
        String code = menu.getCode();
        if (StringUtils.isEmpty(code)) {
            throw new CommonException("error.menu.code.empty");
        }
        if (StringUtils.isEmpty(menu.getName())) {
            throw new CommonException("error.menu.name.empty", code);
        }
        if (StringUtils.isEmpty(menu.getIcon())) {
            throw new CommonException("error.menu.icon.empty", code);
        }
        if (StringUtils.isEmpty(menu.getParentCode())) {
            throw new CommonException("error.menu.parent.code.empty", code);
        }
        if (menu.getSort() == null) {
            menu.setSort(0);
        }
        menu.setDefault(false);
    }

    /**
     * 删除菜单校验.
     * 菜单下有其他菜单，不能删除
     *
     * @param menu 菜单DTO
     */
    public static void deleteValidate(MenuDTO menu) {
        if (menu.getDefault()) {
            throw new CommonException("error.menu.default");
        }
        if (!MenuType.isMenu(menu.getType())) {
            throw new CommonException("error.menu.not.self", menu.getName());
        }
        if (!CollectionUtils.isEmpty(menu.getSubMenus())) {
            throw new CommonException("error.menu.have.children", menu.getName());
        }
    }
}
