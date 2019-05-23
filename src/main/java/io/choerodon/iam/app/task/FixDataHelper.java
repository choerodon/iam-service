package io.choerodon.iam.app.task;

import io.choerodon.base.enums.MenuType;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.DashboardDTO;
import io.choerodon.iam.infra.dto.DashboardRoleDTO;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.mapper.DashboardMapper;
import io.choerodon.iam.infra.mapper.DashboardRoleMapper;
import io.choerodon.iam.infra.mapper.MenuMapper;
import io.choerodon.iam.infra.mapper.MenuPermissionMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 修复数据业务代码
 *
 * @author superlee
 * @since 2019-04-24
 */
@Component
public class FixDataHelper {

    private final Logger logger = LoggerFactory.getLogger(FixDataHelper.class);

    private static final String TOP_SITE = "choerodon.code.top.site";
    private static final String TOP_ORGANIZATION = "choerodon.code.top.organization";
    private static final String TOP_PROJECT = "choerodon.code.top.project";
    private static final String TOP_USER = "choerodon.code.top.user";

    private RoleMapper roleMapper;

    private DashboardMapper dashboardMapper;

    private DashboardRoleMapper dashboardRoleMapper;

    private MenuPermissionMapper menuPermissionMapper;

    private MenuMapper menuMapper;

    public FixDataHelper(MenuPermissionMapper menuPermissionMapper, MenuMapper menuMapper,
                         RoleMapper roleMapper, DashboardMapper dashboardMapper,
                         DashboardRoleMapper dashboardRoleMapper) {
        this.menuPermissionMapper = menuPermissionMapper;
        this.menuMapper = menuMapper;
        this.roleMapper = roleMapper;
        this.dashboardMapper = dashboardMapper;
        this.dashboardRoleMapper = dashboardRoleMapper;
    }

    @Transactional(rollbackFor = Exception.class)
    public void fix() {
        fixMenuPermissionData();
        fixMenuData();
        fixDashboardRole();
    }

    private void fixDashboardRole() {
        Map<Long, String> dashboardMap = new HashMap<>();
        Map<Long, String> roleMap = new HashMap<>();
        for (DashboardDTO dashboard : dashboardMapper.selectAll()) {
            dashboardMap.put(dashboard.getId(), dashboard.getCode());
        }
        for (RoleDTO role : roleMapper.selectAll()) {
            roleMap.put(role.getId(), role.getCode());
        }
        for (DashboardRoleDTO dr : dashboardRoleMapper.selectAll()) {
            try {
                Long roleId = Long.parseLong(dr.getRoleCode());
                Long dashboardId = Long.parseLong(dr.getDashboardCode());
                String roleCode = roleMap.get(roleId);
                String dashboardCode = dashboardMap.get(dashboardId);
                if (roleCode == null || dashboardCode == null) {
                    logger.info("not found role[{}] or dashboard[{}] delete it.", roleId, dashboardCode);
                    dashboardRoleMapper.deleteByPrimaryKey(dr);
                    continue;
                }
                DashboardRoleDTO example = new DashboardRoleDTO();
                example.setRoleCode(roleCode);
                example.setDashboardCode(dashboardCode);
                if (dashboardRoleMapper.selectOne(example) == null) {
                    dr.setRoleCode(roleCode);
                    dr.setDashboardCode(dashboardCode);
                    dashboardRoleMapper.updateByPrimaryKeySelective(dr);
                } else {
                    dashboardRoleMapper.deleteByPrimaryKey(dr);
                }
            } catch (NumberFormatException e) {
                //正常的数据，跳过
            }
        }
    }

    private void fixMenuData() {
        logger.info("start to fix data in iam_menu");
        Map<String, Long> topMenuMap = getTopMenu();

        updateType("menu", MenuType.MENU_ITEM.value());
        updateType("dir", MenuType.MENU.value());
        updateType("root", MenuType.MENU.value());

        updateParentId(topMenuMap);

        updateResourceLevel();
    }

    private void updateResourceLevel() {
        MenuDTO example = new MenuDTO();
        example.setResourceLevel("user");
        menuMapper.select(example).forEach(m -> {
            m.setResourceLevel(ResourceType.SITE.value());
            menuMapper.updateByPrimaryKey(m);
        });
    }

    private void updateType(String oldType, String newType) {
        MenuDTO example = new MenuDTO();
        example.setType(oldType);
        menuMapper.select(example).forEach(m -> {
            String parentCode = m.getParentCode();
            //只有第一次修数据,parentCode才能转为id
            try {
                Long.valueOf(parentCode);
            } catch (Exception e) {
                return;
            }
            m.setType(newType);
            menuMapper.updateByPrimaryKey(m);
        });
    }

    private void updateParentId(Map<String, Long> topMenuMap) {
        for (Map.Entry<String, Long> entry : topMenuMap.entrySet()) {
            String key = entry.getKey();
            Long menuId = entry.getValue();
            MenuDTO example = new MenuDTO();
            example.setResourceLevel(key);
            List<MenuDTO> menus = menuMapper.select(example);
            menus.forEach(m -> {
                if ("0".equals(m.getParentCode())) {
                    m.setParentCode(String.valueOf(menuId));
                    menuMapper.updateByPrimaryKey(m);
                }
            });
        }
        //convert parentId to parentCode
        List<MenuDTO> menus = menuMapper.selectAll();
        for (MenuDTO menu : menus) {
            for (MenuDTO menuDTO : menus) {
                String parentCode = menu.getParentCode();
                Long id = menuDTO.getId();
                if (String.valueOf(id).equals(parentCode)) {
                    menu.setParentCode(menuDTO.getCode());
                    menuMapper.updateByPrimaryKey(menu);
                }
            }
        }
    }

    private Map<String, Long> getTopMenu() {
        Map<String, Long> map = new HashMap<>(4);
        processMap(map, "site", TOP_SITE);
        processMap(map, "organization", TOP_ORGANIZATION);
        processMap(map, "project", TOP_PROJECT);
        processMap(map, "user", TOP_USER);
        return map;
    }

    private void processMap(Map<String, Long> map, String key, String code) {
        MenuDTO example = new MenuDTO();
        example.setCode(code);
        MenuDTO menu = menuMapper.selectOne(example);
        if (menu == null) {
            throw new CommonException("can not find menu, code: " + code);
        }
        map.put(key, menu.getId());
    }

    /**
     * 1.先删除menu_id已经不存在的脏数据
     * 2.根据menu_id查menu,设置menu_code为对应menu的code
     */
    private void fixMenuPermissionData() {
        logger.info("start to fix data in iam_menu_permission");
        List<MenuPermissionDTO> menuPermissions = menuPermissionMapper.selectAll();
        menuPermissions.forEach(
                mp -> {
                    String menuCode = mp.getMenuCode();
                    Long menuId = null;
                    try {
                        menuId = Long.valueOf(menuCode);
                    } catch (Exception e) {
                        return;
                    }
                    MenuDTO menu = menuMapper.selectByPrimaryKey(menuId);
                    if (menu == null) {
                        logger.warn("can not find menu where id = {}, and delete the menu_permission, menu_code = {}, permission_code = {}",
                                menuId, menuId, mp.getPermissionCode());
                        menuPermissionMapper.deleteByPrimaryKey(mp.getId());
                        return;
                    }

                    MenuPermissionDTO example = new MenuPermissionDTO();
                    example.setMenuCode(menu.getCode());
                    example.setPermissionCode(mp.getPermissionCode());
                    if (menuPermissionMapper.selectOne(example) == null) {
                        mp.setMenuCode(menu.getCode());
                        menuPermissionMapper.updateByPrimaryKey(mp);
                    } else {
                        menuPermissionMapper.deleteByPrimaryKey(mp.getId());
                    }
                }
        );
    }
}
