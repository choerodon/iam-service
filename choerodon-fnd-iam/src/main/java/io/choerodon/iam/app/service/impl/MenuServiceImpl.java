//package io.choerodon.iam.app.service.impl;
//
//import io.choerodon.base.enums.MenuType;
//import io.choerodon.base.enums.ResourceType;
//import io.choerodon.core.exception.CommonException;
//import io.choerodon.core.oauth.CustomUserDetails;
//import io.choerodon.iam.app.service.MenuService;
//import io.choerodon.iam.infra.dto.MenuDTO;
//import io.choerodon.iam.infra.mapper.MenuMapper;
//import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
//import io.choerodon.iam.infra.asserts.MenuAssertHelper;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.util.StringUtils;
//
//import java.util.ArrayList;
//import java.util.Comparator;
//import java.util.List;
//
//@Service
//public class MenuServiceImpl implements MenuService {
//
//    private MenuAssertHelper menuAssertHelper;
//
//    private MenuMapper menuMapper;
//
//    public MenuServiceImpl(MenuAssertHelper menuAssertHelper, MenuMapper menuMapper) {
//        this.menuAssertHelper = menuAssertHelper;
//        this.menuMapper = menuMapper;
//    }
//
//    @Override
//    public MenuDTO query(Long id) {
//        return menuMapper.selectByPrimaryKey(id);
//    }
//
//    @Override
//    public MenuDTO create(MenuDTO menuDTO) {
//        preCreate(menuDTO);
//        menuMapper.insertSelective(menuDTO);
//        return menuDTO;
//    }
//
//    @Override
//    public MenuDTO update(Long id, MenuDTO menuDTO) {
//        menuAssertHelper.menuNotExisted(id);
//        menuDTO.setId(id);
//        menuMapper.updateByPrimaryKeySelective(menuDTO);
//        return menuDTO;
//    }
//
//    @Override
//    public List<MenuDTO> menus(String level, Long sourceId) {
//        if (!ResourceType.contains(level)) {
//            throw new CommonException("error.illegal.menu.level", level);
//        }
//        CustomUserDetails userDetails = DetailsHelperAssert.userDetailNotExisted();
//        Long userId = userDetails.getUserId();
//        boolean isAdmin = userDetails.getAdmin();
//        List<MenuDTO> topMenus = getTopMenus(level);
//        List<MenuDTO> menus;
//        if (isAdmin) {
//            MenuDTO dto = new MenuDTO();
//            if (ResourceType.isProject(level)) {
//                //todo menuRepository.queryProjectMenusWithCategoryByRootUser(this.selectProgramMenuCategory(level, sourceId));
//                menus = null;
//            } else {
//                dto.setResourceLevel(level);
//                menus = menuMapper.select(dto);
//            }
//        } else {
//            String category = null;
//            if (ResourceType.isProject(level)) {
//                //todo projectMapper
////                ProjectDO project = projectRepository.selectByPrimaryKey(projectId);
////                if (project.getCategory() != null && !ProjectCategory.AGILE.value().equalsIgnoreCase(project.getCategory())) {
////                    return ProjectCategory.PROGRAM.value().toUpperCase();
////                }
//                category = null;
//            }
//            menus = menuMapper.selectMenusAfterCheckPermission(userId, level, sourceId, category, "user");
//        }
//        topMenus.forEach(top -> toTreeMenu(top, menus));
//        topMenus.sort(Comparator.comparing(MenuDTO::getSort));
//        return topMenus;
//    }
//
//    @Override
//    public MenuDTO menuConfig(String code, String level, String type) {
//        MenuDTO dto = new MenuDTO();
//        dto.setCode(code);
//        dto.setResourceLevel(level);
//        dto.setType(type);
//        MenuDTO menu = menuMapper.selectOne(dto);
//        if (menu == null) {
//            throw new CommonException("error.menu.top.not.existed");
//        }
//        List<MenuDTO> menus = menuMapper.selectMenusWithPermission(level);
//        toTreeMenu(menu, menus);
//        return menu;
//    }
//
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public void saveMenuConfig(String level, List<MenuDTO> menus) {
//        menus.forEach(m -> {
//            saveOrUpdate(m, level);
//        });
//    }
//
//    private void saveOrUpdate(MenuDTO menu, String level) {
//        String code = menu.getCode();
//        if (StringUtils.isEmpty(code)) {
//            throw new CommonException("error.menu.code.empty");
//        }
//        MenuDTO example = new MenuDTO();
//        example.setCode(code);
//        MenuDTO dto = menuMapper.selectOne(example);
//        if (dto == null) {
//            //do insert
//            validate(menu, level);
//            menuMapper.insertSelective(menu);
//        } else {
//            //do update
//            dto.setSort(menu.getSort());
//            dto.setParentId(menu.getParentId());
//            menuMapper.updateByPrimaryKey(dto);
//        }
//        List<MenuDTO> subMenus = menu.getMenus();
//        if (subMenus != null && !subMenus.isEmpty()) {
//            subMenus.forEach(m -> saveOrUpdate(m, level));
//        }
//    }
//
//    private void validate(MenuDTO menu, String level) {
//        menu.setResourceLevel(level);
//        menu.setType(MenuType.MENU.value());
//        String code = menu.getCode();
//        if (StringUtils.isEmpty(menu.getName())) {
//            throw new CommonException("error.menu.name.empty", code);
//        }
//        if (menu.getParentId() == null) {
//            throw new CommonException("error.menu.patentId.null", code);
//        }
//        if (StringUtils.isEmpty(menu.getPagePermissionCode())) {
//            throw new CommonException("error.menu.pagePermissionCode.empty", code);
//        }
//        if (menu.getSort() == null) {
//            menu.setSort(0);
//        }
//        if (menu.getDefault() == null) {
//            menu.setDefault(true);
//        }
//    }
//
//    private List<MenuDTO> getTopMenus(String level) {
//        MenuDTO example = new MenuDTO();
//        example.setResourceLevel(level);
//        example.setType(MenuType.TOP.value());
//        List<MenuDTO> topMenus = menuMapper.select(example);
//        if (topMenus.isEmpty()) {
//            throw new CommonException("error.top.menu.not.existed", level);
//        }
//        return topMenus;
//    }
//
//
//    private void toTreeMenu(MenuDTO parentMenu, List<MenuDTO> menus) {
//        Long id = parentMenu.getId();
//        List<MenuDTO> subMenus = new ArrayList<>();
//        menus.forEach(menu -> {
//            if (menu.getParentId().equals(id)) {
//                subMenus.add(menu);
//                if (MenuType.isMenu(menu.getType())) {
//                    toTreeMenu(menu, menus);
//                }
//            }
//        });
//        subMenus.sort(Comparator.comparing(MenuDTO::getSort));
//        parentMenu.setMenus(subMenus);
//    }
//
//    private void preCreate(MenuDTO menuDTO) {
//        String code = menuDTO.getCode();
//        menuAssertHelper.codeExisted(code);
//        if (menuDTO.getSort() == null) {
//            menuDTO.setSort(0);
//        }
//        if (menuDTO.getParentId() == null) {
//            menuDTO.setParentId(0L);
//        }
//    }
//}
