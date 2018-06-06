package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.validator.MemberRoleValidator;
import io.choerodon.iam.api.validator.RoleAssignmentViewValidator;
import io.choerodon.iam.app.service.RoleMemberService;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;

/**
 * @author superlee
 * @author wuguokai
 */
@RestController
@RequestMapping(value = "/v1")
public class RoleMemberController extends BaseController {

    private RoleMemberService roleMemberService;

    private UserService userService;

    private RoleService roleService;

    @Autowired
    private MemberRoleValidator memberRoleValidator;

    public RoleMemberController(RoleMemberService roleMemberService,
                                UserService userService,
                                RoleService roleService) {
        this.roleMemberService = roleMemberService;
        this.userService = userService;
        this.roleService = roleService;
    }

    /**
     * 在site层分配角色
     * <p>
     * is_edit 是否是编辑，如果false就表示新建角色，true表示是在是编辑角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "用户批量在site层分配角色")
    @PostMapping(value = "/role_members/site_level")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnSiteLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                         @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                         @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.SITE.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnSiteLevel(
                isEdit, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在organization层分配角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "用户批量在organization层分配角色")
    @PostMapping(value = "/role_members/organization_level")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnOrganizationLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                                 @RequestParam(name = "source_id") Long sourceId,
                                                                                 @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                                 @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.ORGANIZATION.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnOrganizationLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在project层分配角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "用户批量在project层分配角色")
    @PostMapping(value = "/role_members/project_level")
    public ResponseEntity<List<MemberRoleDTO>> createOnProjectLevel(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                    @RequestParam(name = "source_id") Long sourceId,
                                                                    @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                    @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.PROJECT.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnProjectLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在site层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "在site层根据成员id和角色id删除角色")
    @PostMapping(value = "/role_members/site_level/delete")
    public ResponseEntity deleteOnSiteLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnSiteLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在organization层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "在organization层根据成员id和角色id删除角色")
    @PostMapping(value = "/role_members/organization_level/delete")
    public ResponseEntity deleteOnOrganizationLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnOrganizationLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在project层根据id删除角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "在project层根据id删除角色")
    @PostMapping(value = "/role_members/project_level/delete")
    public ResponseEntity deleteOnProjectLevel(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleMemberService.deleteOnProjectLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }


    /**------------------>分割线-------------------->分割线------------------>分割线-------------------->*/

    /**
     * 在site层分配角色
     * <p>
     * is_edit 是否是编辑，如果false就表示新建角色，true表示是在是编辑角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层批量分配给用户角色")
    @PostMapping(value = "/site/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnSiteLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                         @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                         @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.SITE.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnSiteLevel(
                isEdit, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在organization层分配角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "组织层批量分配给用户角色")
    @PostMapping(value = "/organizations/{organization_id}/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOrUpdateOnOrganizationLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                                 @PathVariable(name = "organization_id") Long sourceId,
                                                                                 @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                                 @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.ORGANIZATION.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnOrganizationLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在project层分配角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "项目层批量分配给用户角色")
    @PostMapping(value = "/projects/{project_id}/role_members")
    public ResponseEntity<List<MemberRoleDTO>> createOnProjectLevel1(@RequestParam(value = "is_edit", required = false) Boolean isEdit,
                                                                    @PathVariable(name = "project_id") Long sourceId,
                                                                    @RequestParam(name = "member_ids") List<Long> memberIds,
                                                                    @RequestBody ValidList<MemberRoleDTO> memberRoleDTOList) {
        memberRoleValidator.distributionRoleValidator(ResourceLevel.PROJECT.value(), memberRoleDTOList);
        return new ResponseEntity<>(roleMemberService.createOrUpdateRolesByMemberIdOnProjectLevel(
                isEdit, sourceId, memberIds, memberRoleDTOList), HttpStatus.OK);
    }

    /**
     * 在site层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层批量移除用户的角色")
    @PostMapping(value = "/site/role_members/delete")
    public ResponseEntity deleteOnSiteLevel1(@RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(0L);
        roleMemberService.deleteOnSiteLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在organization层根据成员id和角色id删除角色
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "组织层批量移除用户的角色")
    @PostMapping(value = "/organizations/{organization_id}/role_members/delete")
    public ResponseEntity deleteOnOrganizationLevel1(@PathVariable(name = "organization_id") Long sourceId,
                                                    @RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(sourceId);
        roleMemberService.deleteOnOrganizationLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 在project层根据id删除角色
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "项目层批量移除用户的角色")
    @PostMapping(value = "/projects/{project_id}/role_members/delete")
    public ResponseEntity deleteOnProjectLevel1(@PathVariable(name = "project_id") Long sourceId,
                                               @RequestBody @Valid RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        RoleAssignmentViewValidator.validate(roleAssignmentDeleteDTO.getView());
        roleAssignmentDeleteDTO.setSourceId(sourceId);
        roleMemberService.deleteOnProjectLevel(roleAssignmentDeleteDTO);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * 根据角色Id分页查询该角色被分配的用户
     *
     * @param pageRequest
     * @param roleAssignmentSearchDTO
     * @return
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层分页查询角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/site/role_members/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnSiteLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(name = "role_id") Long roleId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnSiteLevel(
                pageRequest, roleAssignmentSearchDTO, roleId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "组织层分页查询角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/organizations/{organization_id}/role_members/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnOrganizationLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(name = "role_id") Long roleId,
            @PathVariable(name = "organization_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnOrganizationLevel(
                pageRequest, roleAssignmentSearchDTO, roleId, sourceId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "项目层分页查询角色下的用户")
    @CustomPageRequest
    @PostMapping(value = "/projects/{project_id}/role_members/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersByRoleIdOnProjectLevel(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(name = "role_id") Long roleId,
            @PathVariable(name = "project_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersByRoleIdOnProjectLevel(
                pageRequest, roleAssignmentSearchDTO, roleId, sourceId), HttpStatus.OK);
    }

    /**
     * 查询site层角色,附带该角色下分配的用户数
     *
     * @return 查询结果
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层查询角色列表以及该角色下的用户数量")
    @PostMapping(value = "/site/role_members/users/count")
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
    @ApiOperation(value = "组织层查询角色列表以及该角色下的用户数量")
    @PostMapping(value = "/organizations/{organization_id}/role_members/users/count")
    public ResponseEntity<List<RoleDTO>> listRolesWithUserCountOnOrganizationLevel(
            @PathVariable(name = "organization_id") Long sourceId,
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
    @ApiOperation(value = "项目层查询角色列表以及该角色下的用户数量")
    @PostMapping(value = "/projects/{project_id}/role_members/users/count")
    public ResponseEntity<List<RoleDTO>> listRolesWithUserCountOnProjectLevel(
            @PathVariable(name = "project_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(roleService.listRolesWithUserCountOnProjectLevel(
                roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }

    /**
     * 在site层查询用户，用户包含拥有的site层的角色
     *
     * @param roleAssignmentSearchDTO 搜索条件
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层查询用户列表以及该用户拥有的角色")
    @CustomPageRequest
    @PostMapping(value = "/site/role_members/users/roles")
    public ResponseEntity<Page<UserWithRoleDTO>> pagingQueryUsersWithSiteLevelRoles(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersWithSiteLevelRoles(
                pageRequest, roleAssignmentSearchDTO), HttpStatus.OK);
    }

    /**
     * 在site层查询用户，用户包含拥有的organization层的角色
     *
     * @param roleAssignmentSearchDTO 搜索条件
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "组织层查询用户列表以及该用户拥有的角色")
    @CustomPageRequest
    @PostMapping(value = "/organizations/{organization_id}/role_members/users/roles")
    public ResponseEntity<Page<UserWithRoleDTO>> pagingQueryUsersWithOrganizationLevelRoles(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @PathVariable(name = "organization_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersWithOrganizationLevelRoles(
                pageRequest, roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }

    /**
     * 在site层查询用户，用户包含拥有的project层的角色
     *
     * @param roleAssignmentSearchDTO 搜索条件
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "项目层查询用户列表以及该用户拥有的角色")
    @CustomPageRequest
    @PostMapping(value = "/projects/{project_id}/role_members/users/roles")
    public ResponseEntity<Page<UserWithRoleDTO>> pagingQueryUsersWithProjectLevelRoles(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @PathVariable(name = "project_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return new ResponseEntity<>(userService.pagingQueryUsersWithProjectLevelRoles(
                pageRequest, roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }
}
