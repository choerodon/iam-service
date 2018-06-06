package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.infra.common.utils.ParamsUtil;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
@RestController
@RequestMapping("/v1/permissions")
public class PermissionController {

    private PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @PostMapping(value = "/checkPermission")
    @Permission(permissionLogin = true)
    public ResponseEntity<List<CheckPermissionDTO>> checkPermission(@RequestBody List<CheckPermissionDTO> checkPermissions) {
        return new ResponseEntity<>(permissionService.checkPermission(checkPermissions), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("通过层级查询权限列表")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<PermissionDTO>> pagingQuery(@RequestParam("level") String level,
                                                           @ApiIgnore
                                                           @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                                   PageRequest pageRequest,
                                                           @RequestParam(required = false) String params) {
        String[] paramArray = ParamsUtil.parseParams(params);
        PermissionDTO permission = new PermissionDTO();
        permission.setLevel(level);
        return new ResponseEntity<>(permissionService.pagingQuery(pageRequest, permission, paramArray), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("通过角色查询权限列表")
    @PostMapping
    public ResponseEntity<Set<PermissionDTO>> queryByRoleIds(@RequestBody List<Long> roleIds) {
        return new ResponseEntity<>(permissionService.queryByRoleIds(roleIds), HttpStatus.OK);
    }

}
