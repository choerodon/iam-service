package io.choerodon.iam.app.service.impl;

import io.choerodon.base.enums.MenuType;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.asserts.MenuAssertHelper;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import io.choerodon.mybatis.entity.Criteria;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 * @author superlee
 */
@Component
public class MenuServiceImpl implements MenuService {

    private ProjectRepository projectRepository;

    private MenuMapper menuMapper;
    private MenuAssertHelper menuAssertHelper;


    public MenuServiceImpl(ProjectRepository projectRepository,
                           MenuMapper menuMapper,
                           MenuAssertHelper menuAssertHelper) {
        this.projectRepository = projectRepository;
        this.menuMapper = menuMapper;
        this.menuAssertHelper = menuAssertHelper;
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
        if (isAdmin) {
            if (ResourceType.isProject(level)) {
                menus = new LinkedHashSet<>(
                        menuMapper.queryProjectMenusWithCategoryByRootUser(getProjectCategory(level, sourceId)));
            } else {
                menus = menuMapper.selectByLevelWithPermissionType(level);
            }
        } else {
            String category = getProjectCategory(level, sourceId);
            menus = new HashSet<>(
                    menuMapper.selectMenusAfterCheckPermission(userId, level, sourceId, category, "user"));
            //查类型为menu的菜单
            MenuDTO dto = new MenuDTO();
            dto.setType(MenuType.MENU.value());
            dto.setResourceLevel(level);
            menus.addAll(menuMapper.select(dto));
        }
        toTreeMenu(topMenu, menus, false);
        return topMenu;
    }

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

    @Override
    public MenuDTO menuConfig(String code) {
        MenuDTO menu = getTopMenuByCode(code);
        String level = menu.getResourceLevel();
        Set<MenuDTO> menus = new HashSet<>(menuMapper.selectMenusWithPermission(level));
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
        menus.forEach(m -> saveOrUpdate(m, topMenu.getResourceLevel()));
    }

    private void saveOrUpdate(MenuDTO menu, String level) {
        String code = menu.getCode();
        if (StringUtils.isEmpty(code)) {
            throw new CommonException("error.menu.code.empty");
        }
        MenuDTO example = new MenuDTO();
        example.setCode(code);
        MenuDTO dto = menuMapper.selectOne(example);
        if (dto == null) {
            //do insert
            validate(menu, level);
            menuMapper.insertSelective(menu);
        } else {
            //do update
            dto.setSort(menu.getSort());
            dto.setParentCode(menu.getParentCode());
            menuMapper.updateByPrimaryKey(dto);
        }
        List<MenuDTO> subMenus = menu.getSubMenus();
        if (subMenus != null && !subMenus.isEmpty()) {
            subMenus.forEach(m -> saveOrUpdate(m, level));
        }
    }

    private void validate(MenuDTO menu, String level) {
        menu.setResourceLevel(level);
        menu.setType(MenuType.MENU.value());
        String code = menu.getCode();
        if (StringUtils.isEmpty(menu.getName())) {
            throw new CommonException("error.menu.name.empty", code);
        }
        if (StringUtils.isEmpty(menu.getParentCode())) {
            throw new CommonException("error.menu.parentCode.empty", code);
        }
        if (menu.getSort() == null) {
            menu.setSort(0);
        }
        menu.setDefault(false);
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
                        // 目录有叶子菜单 放到父级目录的子目录里面
                        if (!menu.getSubMenus().isEmpty()) {
                            subMenus.add(menu);
                        }
                    }
                }
            }
        }
        subMenus.sort(Comparator.comparing(MenuDTO::getSort));
        parentMenu.setSubMenus(subMenus);
    }

    @Override
    public void check(MenuDTO menu) {
        if (StringUtils.isEmpty(menu.getCode())) {
            throw new CommonException("error.menu.code.empty");
        }
        checkCode(menu);
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
