package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.api.dto.RoleSearchDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;


/**
 * @author superlee
 * @author wuguokai
 */
@RestController
@RequestMapping(value = "/v1/roles")
public class RoleController extends BaseController {

    private RoleService roleService;

    private UserService userService;

    public RoleController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    /**
     * 分页查询角色
     *
     * @param pageRequest 分页封装对象
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询角色")
    @CustomPageRequest
    @PostMapping(value = "/search")
    public ResponseEntity<Page<RoleDTO>> list(@ApiIgnore
                                              @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
                                              @RequestParam(value = "need_users", required = false) Boolean needUsers,
                                              @RequestParam(value = "source_id", required = false) Long sourceId,
                                              @RequestParam(value = "source_type", required = false) String sourceType,
                                              @RequestBody(required = false) RoleSearchDTO role) {
        return new ResponseEntity<>(roleService.pagingQuery(
                pageRequest, needUsers, sourceId, sourceType, role), HttpStatus.OK);
    }

    @ApiOperation(value = "通过label查询关联角色列表")
    @GetMapping(value = "/id")
    public ResponseEntity<List<Long>> queryIdsByLabelNameAndLabelType(@RequestParam(value = "label_name") String labelName,
                                                                      @RequestParam(value = "label_type") String labelType) {
        return new ResponseEntity<>(roleService.queryIdsByLabelNameAndLabelType(labelName, labelType), HttpStatus.OK);
    }

    /**
     * 查询site层角色,附带该角色下分配的用户数
     *
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "查询全局层角色")
    @PostMapping(value = "/site_level/user_count")
    public ResponseEntity<List<RoleDTO>> listRolesWithUserCountOnSiteLevel(
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(roleService.listRolesWithUserCountOnSiteLevel(
                roleAssignmentSearchDTO), HttpStatus.OK);
    }

    /**
     * 查询organization层角色,附带该角色下分配的用户数
     *
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "查询组织层角色")
    @PostMapping(value = "/organization_level/user_count")
    public ResponseEntity<List<RoleDTO>> listRolesWithUserCountOnOrganizationLevel(
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(roleService.listRolesWithUserCountOnOrganizationLevel(
                roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }

    /**
     * 查询project层角色,附带该角色下分配的用户数
     *
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "查询项目层角色")
    @PostMapping(value = "/project_level/user_count")
    public ResponseEntity<List<RoleDTO>> listRolesWithUserCountOnProjectLevel(
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(roleService.listRolesWithUserCountOnProjectLevel(
                roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }

    /**
     * 根据角色id查询角色
     *
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "通过id查询角色")
    @GetMapping(value = "/{id}")
    public ResponseEntity<RoleDTO> queryWithPermissionsAndLabels(@PathVariable Long id) {
        return new ResponseEntity<>(roleService.queryWithPermissionsAndLabels(id), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "创建角色")
    @PostMapping
    public ResponseEntity<RoleDTO> create(@RequestBody @Validated RoleDTO roleDTO) {
        roleDTO.insertCheck();
        return new ResponseEntity<>(roleService.create(roleDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "基于已有角色创建角色")
    @PostMapping("/base_on_roles")
    public ResponseEntity<RoleDTO> createBaseOnRoles(@RequestBody @Validated RoleDTO roleDTO) {
        roleDTO.insertCheck();
        return new ResponseEntity<>(roleService.createBaseOnRoles(roleDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "修改角色")
    @PutMapping(value = "/{id}")
    public ResponseEntity<RoleDTO> update(@PathVariable Long id,
                                          @RequestBody RoleDTO roleDTO) {
        roleDTO.setId(id);
        roleDTO.updateCheck();
        //更新操作不能改level
        roleDTO.setLevel(null);
        return new ResponseEntity<>(roleService.update(roleDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "启用角色")
    @PutMapping(value = "/{id}/enable")
    public ResponseEntity<RoleDTO> enableRole(@PathVariable Long id) {
        return new ResponseEntity<>(roleService.enableRole(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "禁用角色")
    @PutMapping(value = "/{id}/disable")
    public ResponseEntity<RoleDTO> disableRole(@PathVariable Long id) {
        return new ResponseEntity<>(roleService.disableRole(id), HttpStatus.OK);
    }

    /**
     * 根据角色Id分页查询该角色被分配的用户
     *
     * @param pageRequest
     * @param roleAssignmentSearchDTO
     * @return
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询全局层角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/{id}/site_level/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnSiteLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @PathVariable(name = "id") Long roleId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnSiteLevel(
                pageRequest, roleAssignmentSearchDTO, roleId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "分页查询组织层角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/{id}/organization_level/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnOrganizationLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @PathVariable(name = "id") Long roleId,
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnOrganizationLevel(
                pageRequest, roleAssignmentSearchDTO, roleId, sourceId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "分页查询项目层角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/{id}/project_level/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnProjectLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @PathVariable(name = "id") Long roleId,
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnProjectLevel(
                pageRequest, roleAssignmentSearchDTO, roleId, sourceId), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "角色信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody RoleDTO role) {
        roleService.check(role);
        return new ResponseEntity(HttpStatus.OK);
    }


}
