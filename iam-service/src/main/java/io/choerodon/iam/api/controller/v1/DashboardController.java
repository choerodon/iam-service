package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.DashboardDTO;
import io.choerodon.iam.api.service.DashboardService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;

/**
 * @author dongfan117@gmail.com
 */
@RestController
@RequestMapping(value = "/v1/dashboards")
public class DashboardController extends BaseController {
    private DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * 根据dashboardId更新Dashboard
     *
     * @param dashboardId  DashboardE Id
     * @param dashboardDto Dashboard对象
     * @return 更新成功的Dashboard对象
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "修改dashboard")
    @PostMapping(value = "/{dashboard_id}")
    public ResponseEntity<DashboardDTO> update(
            @PathVariable("dashboard_id") Long dashboardId,
            @RequestParam(value = "update_role", required = false, defaultValue = "false")
            @ApiParam("是否更新角色列表/默认false") Boolean updateRole,
            @RequestBody DashboardDTO dashboardDto) {
        return new ResponseEntity<>(dashboardService.update(dashboardId, dashboardDto, updateRole), HttpStatus.OK);
    }

    /**
     * 根据DashboardId,查询Dashboard对象
     *
     * @param dashboardId DashboardE Id
     * @return 查询到的Dashboard对象
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "通过id查询Dashboard")
    @GetMapping(value = "/{dashboard_id}")
    public ResponseEntity<DashboardDTO> query(@PathVariable("dashboard_id") Long dashboardId) {
        return new ResponseEntity<>(dashboardService.query(dashboardId), HttpStatus.OK);
    }

    /**
     * 分页模糊查询Dashboard
     *
     * @param pageRequest 分页对象
     * @param name        Dashboard名称
     * @param params      模糊查询参数
     * @return 查询到的Dashboard分页对象
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "分页模糊查询Dashboard")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<DashboardDTO>> list(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String nameSpace,
            @RequestParam(required = false) Boolean enable,
            @RequestParam(required = false) Boolean needRoles,
            @RequestParam(required = false) String[] params) {

        DashboardDTO dashboardDTO = new DashboardDTO();
        dashboardDTO.setName(name);
        dashboardDTO.setCode(code);
        dashboardDTO.setEnabled(enable);
        dashboardDTO.setLevel(level);
        dashboardDTO.setNamespace(nameSpace);
        dashboardDTO.setNeedRoles(needRoles);
        return new ResponseEntity<>(dashboardService.list(dashboardDTO, pageRequest, ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("重置仪表盘配置数据")
    @PutMapping("/reset")
    public void reset(@RequestParam(value = "dashboard_id", required = false) Long dashboardId) {
        dashboardService.reset(dashboardId);
    }

}
