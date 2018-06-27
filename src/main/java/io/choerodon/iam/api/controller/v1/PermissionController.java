package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
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
    @ApiOperation("通过permission code鉴权，判断用户是否有查看的权限")
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
                                                           @RequestParam(required = false) String[] params) {
        PermissionDTO permission = new PermissionDTO();
        permission.setLevel(level);
        return new ResponseEntity<>(permissionService.pagingQuery(pageRequest, permission,
                ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("通过角色查询权限列表")
    @PostMapping
    public ResponseEntity<Set<PermissionDTO>> queryByRoleIds(@RequestBody List<Long> roleIds) {
        return new ResponseEntity<>(permissionService.queryByRoleIds(roleIds), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("通过层级，服务名，code查询Permission列表")
    @GetMapping("/permissionList")
    public ResponseEntity<List<PermissionDTO>> query(@RequestParam("level") String level,
                                                     @RequestParam("service_name") String serviceName,
                                                     @RequestParam("code") String code,
                                                     @ApiIgnore
                                                     @SortDefault(value = "code", direction = Sort.Direction.ASC) PageRequest pageRequest) {
        return new ResponseEntity<>(permissionService.query(level, serviceName, code), HttpStatus.OK);
    }

    /**
     * 根据传入的permission code，与最新更新的Instance抓取的swagger json对比，如果已经废弃了，就删除，没有废弃抛异常
     * @param code the code of permission
     * @return
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("根据permission code删除permission, 只能删除废弃的permission")
    @DeleteMapping
    public ResponseEntity deleteByCode(@RequestParam String code) {
        permissionService.deleteByCode(code);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
