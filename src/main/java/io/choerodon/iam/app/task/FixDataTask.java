package io.choerodon.iam.app.task;

import io.choerodon.asgard.schedule.QuartzDefinition;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.asgard.schedule.annotation.TimedTask;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.iam.infra.dto.MenuPermissionDTO;
import io.choerodon.iam.infra.mapper.MenuMapper;
import io.choerodon.iam.infra.mapper.MenuPermissionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 重构iam表结构后修复数据任务
 *
 * @author superlee
 * @since 2019-04-24
 */
@Component
public class FixDataTask {

    private final Logger logger = LoggerFactory.getLogger(FixDataTask.class);

    private MenuPermissionMapper menuPermissionMapper;

    private MenuMapper menuMapper;

    public FixDataTask(MenuPermissionMapper menuPermissionMapper, MenuMapper menuMapper) {
        this.menuPermissionMapper = menuPermissionMapper;
        this.menuMapper = menuMapper;
    }

    @TimedTask(name = "重构iam表结构后修复数据，只执行一次", description = "重构iam表结构后修复数据，只执行一次",
            oneExecution = true, params = {}, repeatCount = 0, repeatInterval = 0, repeatIntervalUnit = QuartzDefinition.SimpleRepeatIntervalUnit.SECONDS)
    @JobTask(maxRetryCount = 3, code = "fixData", level = ResourceLevel.SITE, description = "重构iam表结构后修复数据任务")
    @Transactional(rollbackFor = Exception.class)
    public void fixData(Map<String, Object> map) {
        fixMenuPermissionData();
        fixMenuData();
    }

    private void fixMenuData() {
        logger.info("start to fix data in iam_menu");

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
