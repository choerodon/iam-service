package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.api.validator.MenuValidator;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.domain.iam.entity.MenuE;
import io.choerodon.iam.domain.repository.MenuRepository;
import io.choerodon.iam.infra.common.utils.menu.MenuTreeUtil;
import io.choerodon.iam.infra.dataobject.MenuDO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author wuguokai
 * @author superlee
 */
@Component
public class MenuServiceImpl implements MenuService {

    private MenuRepository menuRepository;
    private MenuValidator menuValidator;


    public MenuServiceImpl(MenuRepository menuRepository, MenuValidator menuValidator) {
        this.menuRepository = menuRepository;
        this.menuValidator = menuValidator;
    }

    @Override
    public MenuDTO query(Long menuId) {
        MenuE menuE = menuRepository.queryById(menuId);
        return ConvertHelper.convert(menuE, MenuDTO.class);
    }

    @Override
    public MenuDTO create(MenuDTO menuDTO) {
        MenuE menuE = ConvertHelper.convert(menuDTO, MenuE.class);
        menuE.nonDefault();
        menuE = menuRepository.createMenu(menuE);
        return ConvertHelper.convert(menuE, MenuDTO.class);
    }

    @Override
    public Boolean delete(Long menuId) {
        return menuRepository.deleteMenu(menuId);
    }

    @Override
    public MenuDTO update(Long menuId, MenuDTO menuDTO) {
        MenuE menuE = menuRepository.queryById(menuId);
        if (menuE == null) {
            throw new CommonException("error.menu.not.exit");
        }
        if (menuE.getDefault()) {
            throw new CommonException("error.menu.default");
        }
        //菜单已经被更新
        if (!menuE.getObjectVersionNumber().equals(menuDTO.getObjectVersionNumber())) {
            throw new CommonException("error.objectNumber.update");
        }
        if (menuDTO.getName() != null) {
            menuE.editName(menuDTO.getName());
        }
        if (menuDTO.getParentId() != null) {
            menuE.setParentId(menuDTO.getParentId());
        }
        if (menuDTO.getIcon() != null) {
            menuE.updateIcon(menuDTO.getIcon());
        }
        menuE = menuRepository.updateMenu(menuE);
        return ConvertHelper.convert(menuE, MenuDTO.class);
    }

    @Override
    public List<MenuDTO> list(String level) {
        return ConvertHelper.convertList(menuRepository.selectByLevel(level), MenuDTO.class);
    }

    @Override
    public List<MenuDTO> listAfterTestPermission(String level, Long sourceId) {
        CustomUserDetails userDetails = DetailsHelper.getUserDetails();
        if (userDetails == null) {
            return new ArrayList<>();
        }
        boolean isAdmin = userDetails.getAdmin() == null ? false : userDetails.getAdmin();
        //例外super admin,如果是的话能看到所有菜单
        List<MenuDTO> menus;
        if (isAdmin) {
            MenuDO menu = new MenuDO();
            menu.setLevel(level);
            List<MenuDO> menuDOList = menuRepository.select(menu);
            menus = ConvertHelper.convertList(menuDOList, MenuDTO.class);
        } else {
            //如果是menu level是user(个人中心)，不在member_role表里判断sourceType
            String sourceType = ResourceLevel.USER.value().equals(level) ? null : level;
            menus =
                    ConvertHelper.convertList(menuRepository.queryMenusWithPermissionByTestPermission(level,
                            "user", userDetails.getUserId(), sourceType, sourceId), MenuDTO.class);
        }
        return MenuTreeUtil.formatMenu(menus);
    }

    @Override
    public List<MenuDTO> listTreeMenusWithPermissions(Boolean testPermission, String level) {
        List<MenuDTO> menus;
        if (testPermission) {
            CustomUserDetails userDetails = DetailsHelper.getUserDetails();
            if (userDetails == null) {
                return new ArrayList<>();
            }
            //如果是menu level是user(个人中心)，不在member_role表里判断sourceType
            String sourceType = ResourceLevel.USER.value().equals(level) ? null : level;
            menus = ConvertHelper.convertList(menuRepository.queryMenusWithPermissionByTestPermission(level,
                    "user", userDetails.getUserId(), sourceType, null), MenuDTO.class);
        } else {
            menus = queryMenusWithPermissions(level, null);
        }
        return MenuTreeUtil.formatMenu(menus);
    }

    @Override
    public void check(MenuDTO menu) {
        if (StringUtils.isEmpty(menu.getCode())) {
            throw new CommonException("error.menu.code.empty");
        }
        if (StringUtils.isEmpty(menu.getLevel())) {
            throw new CommonException("error.menu.level.empty");
        }
        if (StringUtils.isEmpty(menu.getType())) {
            throw new CommonException("error.menu.type.empty");
        }
        checkCode(menu);
    }

    private void checkCode(MenuDTO menu) {
        boolean createCheck = menu.getId() == null;
        MenuDO menuDO = new MenuDO();
        menuDO.setCode(menu.getCode());
        menuDO.setLevel(menu.getLevel());
        menuDO.setType(menu.getType());
        if (createCheck) {
            Boolean existed = menuRepository.selectOne(menuDO) != null;
            if (existed) {
                throw new CommonException("error.menu.code-level-type.exist");
            }
        } else {
            Long id = menu.getId();
            MenuDO menuDO1 = menuRepository.selectOne(menuDO);
            Boolean existed = menuDO1 != null && !id.equals(menuDO1.getId());
            if (existed) {
                throw new CommonException("error.menu.code-level-type.exist");
            }
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<MenuDTO> saveListTree(String level, List<MenuDTO> menuDTOList) {
        List<MenuDTO> resultList = deFormatMenu(menuDTOList);
        resultList = deleteNeedlessOrAddNewMenu(resultList, level);
        for (MenuDTO menuDTO : resultList) {
            if (menuDTO.getId() != null) {
                menuRepository.updateMenu(ConvertHelper.convert(menuDTO, MenuE.class));
            }
        }
        if (level == null) {
            throw new CommonException("error.menuLevel.null");
        }
        return listTreeMenusWithPermissions(false, level);
    }

    @Override
    public List<MenuDTO> queryMenusWithPermissions(String level, String type) {
        return ConvertHelper.convertList(menuRepository.queryMenusWithPermissions(level, type), MenuDTO.class);
    }


    private List<MenuDTO> deleteNeedlessOrAddNewMenu(List<MenuDTO> menuDTOList, String level) {
        //需要添加的菜单
        List<MenuDTO> addMenus = menuDTOList.stream().filter(item -> item.getId() == null).collect(Collectors.toList());
        List<Long> newMenuIds = menuDTOList.stream().filter(item -> item.getId() != null).map(MenuDTO::getId).collect(Collectors.toList());
        //数据库存在的菜单
        List<MenuDTO> existMenus = list(level);
        List<Long> existMenuIds = existMenus.stream().map(MenuDTO::getId).collect(Collectors.toList());
        //交集，传入的menuId与数据库里存在的menuId相交,需要更新的菜单
        List<Long> intersection = existMenuIds.stream().filter(newMenuIds::contains).collect(Collectors.toList());
        List<Long> menuIds = new ArrayList<>();
        for (MenuDTO dto : existMenus) {
            Long id = dto.getId();
            MenuDO menuDO = new MenuDO();
            menuDO.setParentId(id);
            //非默认菜单或者没有子菜单情况下才能删除
            if (menuRepository.select(menuDO).isEmpty()
                    && !dto.getDefault()) {
                menuIds.add(dto.getId());
            }
        }
        //数据库存在的roleId与交集的差集为要删除的roleId
        List<Long> deleteList = menuIds.stream().filter(item ->
                !intersection.contains(item)).collect(Collectors.toList());
        //删除多余的菜单
        if (!deleteList.isEmpty()) {
            menuRepository.deleteMenusById(deleteList);
        }
        //新建菜单
        addMenus.forEach(menuDTO -> {
            menuValidator.create(menuDTO);
            create(menuDTO);
        });
        return menuDTOList.stream()
                .filter(item -> item.getId() != null)
                .filter(item -> intersection.contains(item.getId()))
                .collect(Collectors.toList());
    }

    //将树形菜单解析成list
    private List<MenuDTO> deFormatMenu(List<MenuDTO> displayMenus) {
        List<MenuDTO> resultList = new ArrayList<>();
        for (MenuDTO menuDTO : displayMenus) {
            autoAddMenu(menuDTO);
            resultList.add(menuDTO);
            if (menuDTO.getSubMenus() != null) {
                deProcessMenu(menuDTO.getSubMenus(), resultList, menuDTO.getId());
            }
        }
        return resultList;
    }

    //递归解析菜单成list
    private void deProcessMenu(List<MenuDTO> menuDTOList, List<MenuDTO> resultList, Long parentId) {
        for (MenuDTO menuDTO : menuDTOList) {
            menuDTO.setParentId(parentId);
            autoAddMenu(menuDTO);
            resultList.add(menuDTO);
            if (menuDTO.getSubMenus() != null) {
                deProcessMenu(menuDTO.getSubMenus(), resultList, menuDTO.getId());
            }
        }
    }

    private void autoAddMenu(MenuDTO menuDTO) {
        if (menuDTO.getId() == null) {
            menuValidator.create(menuDTO);
            MenuDTO newMenuDTO = create(menuDTO);
            menuDTO.setId(newMenuDTO.getId());
            menuDTO.setObjectVersionNumber(newMenuDTO.getObjectVersionNumber());
        }
    }
}
