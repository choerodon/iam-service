package io.choerodon.iam.app.task;

import io.choerodon.base.enums.MenuType;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import io.choerodon.iam.infra.mapper.MenuPermissionMapper;
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

    private MenuPermissionMapper menuPermissionMapper;

    private MenuMapper menuMapper;

    public FixDataHelper(MenuPermissionMapper menuPermissionMapper, MenuMapper menuMapper) {
        this.menuPermissionMapper = menuPermissionMapper;
        this.menuMapper = menuMapper;
    }

    @Transactional(rollbackFor = Exception.class)
    public void fix() {
        fixMenuPermissionData();
        fixMenuData();
    }

    private void fixMenuData() {
        logger.info("start to fix data in iam_menu");
        Map<String, Long> topMenuMap = getTopMenu();

        updateParentId(topMenuMap);

        updateType("menu", MenuType.MENU_ITEM.value());
        updateType("root", MenuType.MENU.value());
        updateType("dir", MenuType.MENU.value());

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
        menuPermissionMapper.deleteDirtyData();
        List<MenuPermissionDTO> menuPermissions = menuPermissionMapper.selectAll();
        menuPermissions.forEach(
                mp -> {
                    String menuCode = mp.getMenuCode();
                    Long menuId = null;
                    try {
                        menuId = Long.valueOf(menuCode);
                    } catch (Exception e) {
                        logger.error("cast code to id error, menuCode: {}", menuCode);
                        return;
                    }
                    MenuDTO menu = menuMapper.selectByPrimaryKey(menuId);
                    if (menu == null) {
                        logger.error("can not find menu where id = {}", menuId);
                        return;
                    }
                    mp.setMenuCode(menu.getCode());
                    menuPermissionMapper.updateByPrimaryKey(mp);
                }
        );
    }
}
