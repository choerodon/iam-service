package io.choerodon.iam.api.validator;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.infra.dataobject.MenuDO;
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
        String level = menuDTO.getLevel();
        String type = menuDTO.getType();
        MenuTypeValidator.validate(type);
        ResourceLevelValidator.validate(level);
        MenuDO menu = new MenuDO();
        menu.setCode(menuDTO.getCode());
        menu.setLevel(level);
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
        menuDTO1.setZhName(menuDTO.getZhName());
        menuDTO1.setEnName(menuDTO.getEnName());
        menuDTO1.setIcon(menuDTO.getIcon());
        menuDTO1.setObjectVersionNumber(menuDTO.getObjectVersionNumber());
        return menuDTO1;
    }

    //有子节点的目录不能删除
    public void delete(Long menuId) {
        MenuDO menuDO = new MenuDO();
        menuDO.setParentId(menuId);
        if (!menuMapper.select(menuDO).isEmpty()) {
            throw new CommonException("error.menu.have.children");
        }
        menuDO = menuMapper.selectByPrimaryKey(menuId);
        if (menuDO == null) {
            throw new CommonException("error.menu.not.exist");
        }
        if (menuDO.getDefault()) {
            throw new CommonException("error.menu.default");
        }
    }
}
