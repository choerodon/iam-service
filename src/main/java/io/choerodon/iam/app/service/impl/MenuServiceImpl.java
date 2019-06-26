package io.choerodon.iam.app.service.impl;

import io.choerodon.base.enums.MenuType;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.iam.api.validator.MenuValidator;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.asserts.MenuAssertHelper;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import io.choerodon.iam.infra.mapper.MenuPermissionMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.PermissionMapper;
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper;
import io.choerodon.mybatis.entity.Criteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @author wuguokai
 * @author superlee
 */
@Component
public class MenuServiceImpl implements MenuService {

    @Value("${choerodon.category.enabled:false}")
    private boolean enableCategory;

    private ProjectRepository projectRepository;
    private OrganizationMapper organizationMapper;
    private MenuMapper menuMapper;
    private ProjectMapCategoryMapper projectMapCategoryMapper;
    private MenuAssertHelper menuAssertHelper;
    private PermissionMapper permissionMapper;
    private MenuPermissionMapper menuPermissionMapper;


    public MenuServiceImpl(ProjectRepository projectRepository, OrganizationMapper organizationMapper,
                           MenuMapper menuMapper, MenuAssertHelper menuAssertHelper,
                           ProjectMapCategoryMapper projectMapCategoryMapper, PermissionMapper permissionMapper, MenuPermissionMapper menuPermissionMapper) {
        this.projectRepository = projectRepository;
        this.organizationMapper = organizationMapper;
        this.menuMapper = menuMapper;
        this.menuAssertHelper = menuAssertHelper;
        this.projectMapCategoryMapper = projectMapCategoryMapper;
        this.permissionMapper = permissionMapper;
        this.menuPermissionMapper = menuPermissionMapper;
    }

    @Override
    public MenuDTO query(Long id) {
        return menuMapper.selectByPrimaryKey(id);
    }

    @Override
    public MenuDTO create(MenuDTO menuDTO) {
        preCreate(menuDTO);
        menuMapper.insertSelective(menuDTO);
        return menuDTO;
    }

    private void preCreate(MenuDTO menuDTO) {
        menuAssertHelper.codeExisted(menuDTO.getCode());
        if (menuDTO.getSort() == null) {
            menuDTO.setSort(0);
        }
        if (menuDTO.getParentCode() == null) {
            menuDTO.setParentCode("");
        }
        String level = menuDTO.getResourceLevel();
        if (!ResourceType.contains(level)) {
            throw new CommonException("error.illegal.level");
        }
        String type = menuDTO.getType();
        if (!MenuType.contains(type)) {
            throw new CommonException("error.menu.illegal.type", type);
        }
    }

    @Override
    public void delete(Long id) {
        MenuDTO dto = menuAssertHelper.menuNotExisted(id);
        if (dto.getDefault()) {
            throw new CommonException("error.menu.default");
        }
        menuMapper.deleteByPrimaryKey(id);
    }

    @Override
    public MenuDTO update(Long id, MenuDTO menuDTO) {
        MenuDTO dto = menuAssertHelper.menuNotExisted(id);
        if (dto.getDefault()) {
            throw new CommonException("error.menu.default");
        }
        menuDTO.setId(id);
        Criteria criteria = new Criteria();
        criteria.update("name", "icon", "page_permission_code", "search_condition", "category");
        menuMapper.updateByPrimaryKeyOptions(menuDTO, criteria);
        return menuMapper.selectByPrimaryKey(id);
    }

    @Override
    public MenuDTO menus(String code, Long sourceId) {
        MenuDTO topMenu = getTopMenuByCode(code);
        String level = topMenu.getResourceLevel();
        CustomUserDetails userDetails = DetailsHelperAssert.userDetailNotExisted();
        Long userId = userDetails.getUserId();
        boolean isAdmin = userDetails.getAdmin();
        Set<MenuDTO> menus;
        if ((ResourceType.isProject(level) || ResourceType.isOrganization(level)) && enableCategory) {
            menus = menusByCategory(isAdmin, userId, level, sourceId);
        } else {
            if (isAdmin) {
                if (ResourceType.isProject(level)) {
                    menus = new LinkedHashSet<>(
                            menuMapper.queryProjectMenusWithCategoryByRootUser(getProjectCategory(level, sourceId)));
                } else {
                    menus = menuMapper.selectByLevelWithPermissionType(level, sourceId);
                }
            } else {
                menus = new HashSet<>(
                        menuMapper.selectMenusAfterCheckPermission(userId, level, sourceId, getProjectCategory(level, sourceId), "user"));

            }
        }
        //查类型为menu的菜单
        MenuDTO dto = new MenuDTO();
        dto.setType(MenuType.MENU.value());
        dto.setResourceLevel(level);
        List<MenuDTO> allMenus = menuMapper.select(dto);
        //筛除重复menu
        Set<Long> menuIds = menus.stream().map(m -> m.getId()).collect(Collectors.toSet());
        Set<MenuDTO> menuCollect = allMenus.stream().filter(m -> !menuIds.contains(m.getId())).collect(Collectors.toSet());
        //添加类型为menu的菜单
        menus.addAll(menuCollect);
        toTreeMenu(topMenu, menus, false);
        return topMenu;
    }


    /**
     * menus 项目/组织  开启类别控制
     *
     * @param isAdmin
     * @param userId
     * @param level
     * @param sourceId
     * @return
     */
    private Set<MenuDTO> menusByCategory(Boolean isAdmin, Long userId, String level, Long sourceId) {
        Set<MenuDTO> menus;
        List<String> categories = getCategories(level, sourceId);
        if (CollectionUtils.isEmpty(categories)) {
            throw new CommonException("error.category.not.exist");
        }
        if (isAdmin) {
            menus = new LinkedHashSet<>(
                    menuMapper.queryMenusWithCategoryAndLevelByRootUser(getCategories(level, sourceId), level));

        } else {
            menus = new HashSet<>(
                    menuMapper.selectMenusAfterPassingThePermissionCheck(userId, level, sourceId, getCategories(level, sourceId), "user"));
        }
        return menus;
    }

    /**
     * 开源版本获取 category
     * project 与 category 一对一，存于 FD_PROJECT 表中
     * organization 没有 category
     *
     * @param level
     * @param sourceId
     * @return
     */
    private String getProjectCategory(String level, Long sourceId) {
        String category = null;
        if (ResourceType.isProject(level)) {
            ProjectDTO project = projectRepository.selectByPrimaryKey(sourceId);
            if (project != null) {
                category = project.getCategory();
            }
        }
        return category;
    }


    /**
     * 非开源版本获取 category
     * organization 与 category 一对一，存于 FD_ORGANIZATION 表中
     * project 与 category 一对多，存于 FD_PROJECT_MAP_CATEGORY 表中
     *
     * @param level
     * @param sourceId
     * @return
     */
    private List<String> getCategories(String level, Long sourceId) {
        List<String> categories = new ArrayList<>();
        if (ResourceType.isProject(level)) {
            categories.addAll(projectMapCategoryMapper.selectProjectCategories(sourceId));
        }
        if (ResourceType.isOrganization(level)) {
            OrganizationDTO organizationDTO = organizationMapper.selectByPrimaryKey(sourceId);
            if (organizationDTO != null) {
                categories.add(organizationDTO.getCategory());
            }
        }
        return categories;
    }

    @Override
    public MenuDTO menuConfig(String code, Long sourceId) {
        MenuDTO menu = getTopMenuByCode(code);
        String level = menu.getResourceLevel();
        Set<MenuDTO> menus = new HashSet<>(menuMapper.selectMenusWithPermission(level, sourceId));
        toTreeMenu(menu, menus, true);
        return menu;
    }

    private MenuDTO getTopMenuByCode(String code) {
        MenuDTO dto = new MenuDTO();
        dto.setCode(code);
        MenuDTO menu = menuMapper.selectOne(dto);
        if (menu == null) {
            throw new CommonException("error.menu.top.not.existed");
        }
        return menu;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void saveMenuConfig(String code, List<MenuDTO> menus) {
        MenuDTO topMenu = getTopMenuByCode(code);
        String level = topMenu.getResourceLevel();
        // 传入的菜单列表
        List<MenuDTO> submitMenuList = menuTreeToList(menus);
        // 数据库已存在的菜单
        List<MenuDTO> existMenus = getMenuByResourceLevel(level);
        // 实际要插入的菜单
        List<MenuDTO> insertMenus = submitMenuList.stream().filter(item -> item.getId() == null).collect(Collectors.toList());
        // 传入的更新菜单列表
        List<MenuDTO> submitUpdateMenus = submitMenuList.stream().filter(item -> item.getId() != null).collect(Collectors.toList());
        // 实际要更新的菜单
        List<MenuDTO> updateMenus = new ArrayList<>();
        // 实际要删除的菜单
        List<MenuDTO> deleteMenus = new ArrayList<>();
        // 数据库已存在的菜单跟传入的更新菜单做对比  如果已存在的菜单不在更新菜单列表里 表示菜单已被删除 否则表示菜单需更新
        if (!CollectionUtils.isEmpty(existMenus)) {
            for (MenuDTO existMenu : existMenus) {
                boolean needToDelete = true;
                for (MenuDTO submitMenu : submitUpdateMenus) {
                    if (existMenu.getId().equals(submitMenu.getId())) {
                        updateMenus.add(submitMenu);
                        needToDelete = false;
                        break;
                    }
                }
                if (needToDelete) {
                    if (MenuType.isMenu(existMenu.getType())) {
                        boolean isNotDefaultMenu = existMenu.getDefault() != null && !existMenu.getDefault();
                        // 追溯到自设目录的根目录 只有与传入根目录相同的才删除
                        if (isNotDefaultMenu) {
                            MenuDTO deleteTopMenu = getTopMenu(existMenu);
                            if (topMenu.getCode().equalsIgnoreCase(deleteTopMenu.getCode())) {
                                deleteMenus.add(existMenu);
                            }
                        }
                    }
                }
            }
        }
        //do insert
        if (!CollectionUtils.isEmpty(insertMenus)) {
            for (MenuDTO insertMenu : insertMenus) {
                MenuValidator.insertValidate(insertMenu, level);
                menuMapper.insertSelective(insertMenu);
            }
        }
        // do update
        if (!CollectionUtils.isEmpty(updateMenus)) {
            for (MenuDTO updateMenu : updateMenus) {
                boolean isNotDefault = MenuType.isMenu(updateMenu.getType()) && updateMenu.getDefault() != null && !updateMenu.getDefault();
                // only self menu can update name and icon
                MenuDTO menuDTO = new MenuDTO();
                if (isNotDefault) {
                    menuDTO.setName(updateMenu.getName());
                    menuDTO.setIcon(updateMenu.getIcon());
                }
                menuDTO.setSort(updateMenu.getSort());
                menuDTO.setParentCode(updateMenu.getParentCode());
                menuDTO.setId(updateMenu.getId());
                menuDTO.setObjectVersionNumber(updateMenu.getObjectVersionNumber());
                menuMapper.updateByPrimaryKeySelective(menuDTO);
            }
        }
        // do delete
        if (!CollectionUtils.isEmpty(deleteMenus)) {
            for (MenuDTO deleteMenu : deleteMenus) {
                MenuValidator.deleteValidate(deleteMenu);
                menuMapper.deleteByPrimaryKey(deleteMenu);
            }
        }
    }

    @Override
    public List<MenuDTO> list() {
        return menuMapper.selectAll();
    }

    /**
     * 根据自设目录追溯到根目录.
     *
     * @param menuDTO 自设目录
     * @return 根目录
     */
    private MenuDTO getTopMenu(MenuDTO menuDTO) {
        if (MenuType.isTop(menuDTO.getType())) {
            return menuDTO;
        }
        MenuDTO result = new MenuDTO();
        result.setCode(menuDTO.getParentCode());
        result = menuMapper.selectOne(result);
        if (!MenuType.isTop(result.getType())) {
            result = getTopMenu(result);
        }
        return result;
    }

    /**
     * 根据资源层级查询菜单列表.
     *
     * @param level 资源层级
     * @return 菜单列表
     */
    private List<MenuDTO> getMenuByResourceLevel(String level) {
        MenuDTO menuDTO = new MenuDTO();
        menuDTO.setResourceLevel(level);
        return menuMapper.select(menuDTO);
    }

    /**
     * 树形菜单转换为List菜单.
     *
     * @param menus 树形菜单
     * @return List菜单
     */
    private List<MenuDTO> menuTreeToList(List<MenuDTO> menus) {
        List<MenuDTO> menuList = new ArrayList<>();
        if (!CollectionUtils.isEmpty(menus)) {
            doProcessMenu(menus, menuList);
        }
        return menuList;
    }

    /**
     * 递归解析树形菜单为List菜单.
     *
     * @param menus    树形菜单
     * @param menuList List菜单
     */
    private void doProcessMenu(List<MenuDTO> menus, List<MenuDTO> menuList) {
        for (MenuDTO menuDTO : menus) {
            menuList.add(menuDTO);
            if (menuDTO.getSubMenus() != null) {
                doProcessMenu(menuDTO.getSubMenus(), menuList);
            }
        }
    }

    /**
     * 转换树形菜单.
     * 情况1：用户菜单不显示空目录
     * 情况2：菜单配置显示空目录
     *
     * @param parentMenu      父级菜单
     * @param menus           所有菜单列表
     * @param isShowEmptyMenu 是否显示空目录
     */
    private void toTreeMenu(MenuDTO parentMenu, Set<MenuDTO> menus, Boolean isShowEmptyMenu) {
        String code = parentMenu.getCode();
        List<MenuDTO> subMenus = new ArrayList<>();
        for (MenuDTO menu : menus) {
            if (code.equalsIgnoreCase(menu.getParentCode())) {
                // 如果是叶子菜单 直接放到父级目录的子菜单列表里面
                if (MenuType.isMenuItem(menu.getType())) {
                    subMenus.add(menu);
                }
                if (MenuType.isMenu(menu.getType())) {
                    toTreeMenu(menu, menus, isShowEmptyMenu);
                    if (isShowEmptyMenu) {
                        subMenus.add(menu);
                    } else {
                        // 目录有叶子菜单 放到父级目录的子目录里面(过滤空目录)
                        if (!CollectionUtils.isEmpty(menu.getSubMenus())) {
                            subMenus.add(menu);
                        }
                    }
                }
            }
        }
        if (CollectionUtils.isEmpty(subMenus)) {
            parentMenu.setSubMenus(null);
        } else {
            subMenus.sort(Comparator.comparing(MenuDTO::getSort));
            parentMenu.setSubMenus(subMenus);
        }
    }

    @Override
    public void check(MenuDTO menu) {
        if (StringUtils.isEmpty(menu.getCode())) {
            throw new CommonException("error.menu.code.empty");
        }
        checkCode(menu);
    }

    @Override
    public void createApp(MenuDTO menu) {
        menu.setCategory("MODEL");
        menu.setServiceCode("low-code-service");
        menu.setResourceLevel(ResourceType.ORGANIZATION.value());
        menu.setType(MenuType.MENU_ITEM.value());
        menu.setPagePermissionCode("low-code-service.route." + menu.getModelCode());

        MenuDTO example = new MenuDTO();
        example.setCode(menu.getCode());
        example.setSourceId(menu.getSourceId());
        MenuDTO result = menuMapper.selectOne(example);
        if (result != null){
            menu.setId(result.getId());
            menu.setObjectVersionNumber(result.getObjectVersionNumber());
            menuMapper.updateByPrimaryKeySelective(menu);
        } else {
            menuMapper.insertSelective(menu);
            PermissionDTO permission = new PermissionDTO();
            permission.setCode("low-code-service.route." + menu.getModelCode());
            permission.setPath("/lc/model/" + menu.getModelCode());
            permission.setResourceLevel(ResourceType.ORGANIZATION.value());
            permission.setDescription(menu.getName() + "路由");
            permission.setPublicAccess(false);
            permission.setLoginAccess(false);
            permission.setWithin(false);
            permission.setServiceCode("low-code-service");
            permissionMapper.insertSelective(permission);
            MenuPermissionDTO menuPermission = new MenuPermissionDTO();
            menuPermission.setMenuCode(menu.getCode());
            menuPermission.setPermissionCode(permission.getCode());
            menuPermissionMapper.insert(menuPermission);
        }
    }

    private void checkCode(MenuDTO menu) {
        boolean createCheck = menu.getId() == null;
        MenuDTO dto = new MenuDTO();
        dto.setCode(menu.getCode());
        if (createCheck) {
            if (!menuMapper.select(dto).isEmpty()) {
                throw new CommonException("error.menu.code-level-type.exist");
            }
        } else {
            Long id = menu.getId();
            MenuDTO menuDTO = menuMapper.selectOne(dto);
            Boolean existed = menuDTO != null && !id.equals(menuDTO.getId());
            if (existed) {
                throw new CommonException("error.menu.code-level-type.exist");
            }
        }
    }
}
