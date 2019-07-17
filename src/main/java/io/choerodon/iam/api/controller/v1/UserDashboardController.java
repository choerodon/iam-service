package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.app.service.UserDashboardService;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.infra.dto.UserDashboardDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * @author dongfan117@gmail.com
 */
@RestController
@RequestMapping(value = "/v1/home/")
public class UserDashboardController {

    private UserDashboardService userDashboardService;

    public UserDashboardController(UserDashboardService userDashboardService) {
        this.userDashboardService = userDashboardService;
    }

    /**
     * 获取全局层的Dashboard
     *
     * @param level    dashboard层级
     * @param sourceId 组织或项目id
     */
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation("根据层级获取用户首页dashboard")
    @GetMapping("/dashboard")
    public ResponseEntity<List<UserDashboardDTO>> list(
            @RequestParam(name = "level") String level,
            @RequestParam(name = "source_id", defaultValue = "0") Long sourceId) {
        ResourceLevelValidator.validate(level);
        if (ResourceLevel.SITE.value().equals(level)) {
            sourceId = 0L;
        }
        return new ResponseEntity<>(userDashboardService.list(level, sourceId), HttpStatus.OK);
    }

    /**
     * 保存Dashboard
     *
     * @param level         dashboard层级
     * @param sourceId      组织或项目id
     * @param dashboardList 需要保存的Dashboard list
     */
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation("根据层级修改用户dashboard")
    @PostMapping("/dashboard")
    public ResponseEntity<List<UserDashboardDTO>> update(
            @RequestParam(name = "level") String level,
            @RequestParam(name = "source_id", defaultValue = "0") Long sourceId,
            @RequestBody @Valid ValidList<UserDashboardDTO> dashboardList) {
        ResourceLevelValidator.validate(level);
        if (ResourceLevel.SITE.value().equals(level)) {
            sourceId = 0L;
        }
        return new ResponseEntity<>(userDashboardService.update(level, sourceId, dashboardList), HttpStatus.OK);
    }


    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation("根据用户、层级、sourceId重置dashboard")
    @PutMapping("/dashboard/reset")
    public void reset(@RequestParam(name = "level") String level,
                      @RequestParam(name = "source_id", defaultValue = "0") Long sourceId) {
        userDashboardService.reset(level, sourceId);
    }

}
