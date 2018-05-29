package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.domain.iam.entity.MenuE;
import io.choerodon.iam.domain.repository.MenuRepository;
import io.choerodon.iam.infra.dataobject.MenuDO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 */
@Component
public class MenuRepositoryImpl implements MenuRepository {

    private MenuMapper menuMapper;

    public MenuRepositoryImpl(MenuMapper menuMapper) {
        this.menuMapper = menuMapper;
    }

    @Override
    public MenuE queryById(Long menuId) {
        MenuDO menuDO = menuMapper.selectByPrimaryKey(menuId);
        return ConvertHelper.convert(menuDO, MenuE.class);
    }

    @Override
    public MenuE createMenu(MenuE menuE) {
        MenuDO menuDO = ConvertHelper.convert(menuE, MenuDO.class);
        int isInsert = menuMapper.insertSelective(menuDO);
        if (isInsert != 1) {
            throw new CommonException("error.menu.create");
        }
        menuDO = menuMapper.selectByPrimaryKey(menuDO.getId());
        return ConvertHelper.convert(menuDO, MenuE.class);
    }

    @Override
    public MenuE updateMenu(MenuE menuE) {
        MenuDO menuDO = ConvertHelper.convert(menuE, MenuDO.class);
        int isUpdate = menuMapper.updateByPrimaryKeySelective(menuDO);
        if (isUpdate != 1) {
            throw new CommonException("error.menu.update");
        }
        menuDO = menuMapper.selectByPrimaryKey(menuDO.getId());
        return ConvertHelper.convert(menuDO, MenuE.class);
    }

    @Override
    public Boolean deleteMenu(Long menuId) {
        int isDelete = menuMapper.deleteByPrimaryKey(menuId);
        if (isDelete != 1) {
            throw new CommonException("error.menu.delete");
        }
        return true;
    }

    @Override
    public void deleteMenusById(List<Long> menuIds) {
        menuMapper.deleteMenusById(menuIds);
    }

    @Override
    public List<MenuDTO> queryAll() {
        return ConvertHelper.convertList(menuMapper.queryIncludeTl(), MenuDTO.class);
    }

    @Override
    public List<MenuDO> selectByLevel(String level) {
        MenuDO menuDO = new MenuDO();
        menuDO.setLevel(level);
        return menuMapper.select(menuDO);
    }

    @Override
    public List<MenuDO> queryMenusWithPermissions(String level, String type) {
        return menuMapper.queryMenusWithPermissions(level, type);
    }

    @Override
    public List<MenuDO> queryMenusWithPermissionByTestPermission(String level, String memberType, Long memberId, String sourceType, Long sourceId) {
        return menuMapper.queryMenusWithPermissionByTestPermission(level, memberType, memberId, sourceType, sourceId);
    }
}
