package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.dto.CheckPermissionDTO;
import io.choerodon.iam.app.service.PermissionService;
import io.choerodon.iam.infra.dto.PermissionDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Permission(type = ResourceType.SITE)
    @ApiOperation("通过层级查询权限列表")
    @GetMapping
    public ResponseEntity<PageInfo<PermissionDTO>> pagingQuery(@RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                               @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                               @RequestParam("level") String level,
                                                               @RequestParam(required = false) String param) {
        PermissionDTO dto = new PermissionDTO();
        dto.setResourceLevel(level);
        return new ResponseEntity<>(permissionService.pagingQuery(page, size, dto, param), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("通过角色查询权限列表")
    @PostMapping
    public ResponseEntity<Set<PermissionDTO>> queryByRoleIds(@RequestBody List<Long> roleIds) {
        return new ResponseEntity<>(permissionService.queryByRoleIds(roleIds), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation("组织层通过角色查询权限列表")
    @PostMapping("/through_roles_at_org")
    public ResponseEntity<Set<PermissionDTO>> queryByRoleIdsAtOrg(@RequestBody List<Long> roleIds) {
        return new ResponseEntity<>(permissionService.queryByRoleIds(roleIds), HttpStatus.OK);
    }


    @Permission(type = ResourceType.SITE)
    @ApiOperation("通过层级，服务名，code查询Permission列表")
    @GetMapping("/permissionList")
    public ResponseEntity<List<PermissionDTO>> query(@RequestParam("level") String level,
                                                     @RequestParam(value = "service_name", required = false) String serviceName,
                                                     @RequestParam(value = "code", required = false) String code) {
        return new ResponseEntity<>(permissionService.query(level, serviceName, code), HttpStatus.OK);
    }

    /**
     * 根据传入的permission code，与最新更新的Instance抓取的swagger json对比，如果已经废弃了，就删除，没有废弃抛异常
     *
     * @param code the code of permission
     * @return
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation("根据permission code删除permission, 只能删除废弃的permission")
    @DeleteMapping
    public ResponseEntity deleteByCode(@RequestParam String code) {
        permissionService.deleteByCode(code);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

}
