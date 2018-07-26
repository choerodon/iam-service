package io.choerodon.iam.api.controller.v1;

import java.util.List;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.api.dto.UserDashboardDTO;
import io.choerodon.iam.api.service.UserDashboardService;
import io.choerodon.iam.domain.iam.entity.UserDashboard;
import io.choerodon.swagger.annotation.Permission;

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
     * @return
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation("根据层级获取用户首页dashboard")
    @GetMapping("/dashboard")
    public ResponseEntity<List<UserDashboardDTO>> list(
            @RequestParam(name = "level") String level,
            @RequestParam(name = "source_id", defaultValue = "0") Long sourceId) {
        return new ResponseEntity<>(userDashboardService.list(level, sourceId), HttpStatus.OK);
    }

    /**
     * 保存Dashboard
     *
     * @param level         dashboard层级
     * @param sourceId      组织或项目id
     * @param dashboardList 需要保存的Dashboard list
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation("根据层级修改用户dashboard")
    @PostMapping("/dashboard")
    public ResponseEntity<List<UserDashboardDTO>> update(
            @RequestParam(name = "level") String level,
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody @Valid ValidList<UserDashboard> dashboardList) {
        return new ResponseEntity<>(userDashboardService.update(level, sourceId, dashboardList), HttpStatus.OK);
    }
}
