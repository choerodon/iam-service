package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class MenuValidator {
    private MenuMapper menuMapper;

    public MenuValidator(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }

    //code不能重复
    public void create(MenuDTO menuDTO) {
        String level = menuDTO.getResourceLevel();
        String type = menuDTO.getType();
        MenuTypeValidator.validate(type);
        ResourceLevelValidator.validate(level);
        MenuDTO menu = new MenuDTO();
        menu.setCode(menuDTO.getCode());
        menu.setResourceLevel(level);
        menu.setType(type);
        if (!menuMapper.select(menu).isEmpty()) {
            throw new CommonException("error.menuCode.exist");
        }
    }

    //只能更新名称和图标
    public MenuDTO update(Long menuId, MenuDTO menuDTO) {
        if (menuMapper.selectByPrimaryKey(menuId) == null) {
            throw new CommonException("error.menu.not.exist");
        }
        MenuDTO menuDTO1 = new MenuDTO();
        menuDTO1.setId(menuId);
        menuDTO1.setName(menuDTO.getName());
        menuDTO1.setIcon(menuDTO.getIcon());
        menuDTO1.setObjectVersionNumber(menuDTO.getObjectVersionNumber());
        return menuDTO1;
    }

    //有子节点的目录不能删除
    public void delete(Long menuId) {
        MenuDTO menuDTO = new MenuDTO();
        menuDTO.setParentId(menuId);
        if (!menuMapper.select(menuDTO).isEmpty()) {
            throw new CommonException("error.menu.have.children");
        }
        menuDTO = menuMapper.selectByPrimaryKey(menuId);
        if (menuDTO == null) {
            throw new CommonException("error.menu.not.exist");
        }
        if (menuDTO.getDefault()) {
            throw new CommonException("error.menu.default");
        }
    }
}
