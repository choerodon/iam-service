package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.NotFoundException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

/**
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/users")
public class UserController extends BaseController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "查询当前用户信息")
    @GetMapping(value = "/self")
    public ResponseEntity<UserDTO> querySelf() {
        return new ResponseEntity<>(userService.querySelf(), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "查询当前用户的个人中心数据")
    @GetMapping(value = "/{id}/info")
    public ResponseEntity<UserInfoDTO> queryInfo(@PathVariable Long id) {
        return Optional.ofNullable(userService.queryInfo(id))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(() -> new NotFoundException());
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "更新当前用户的个人中心数据")
    @PutMapping(value = "/{id}/info")
    public ResponseEntity<UserInfoDTO> updateInfo(@PathVariable Long id,
                                                  @RequestBody @Valid UserInfoDTO userInfo) {
        userInfo.setId(id);
        userInfo.updateCheck();
        //不能修改状态
        userInfo.setEnabled(null);
        userInfo.setOrganizationId(null);
        userInfo.setLoginName(null);
        return new ResponseEntity<>(userService.updateInfo(userInfo), HttpStatus.OK);
    }

    /**
     * 上传头像到文件服务返回头像url
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "上传头像到文件服务返回头像url")
    @PostMapping(value = "/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestPart MultipartFile file) {
        return new ResponseEntity<>(userService.uploadPhoto(id, file), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询当前用户被分配的所有组织")
    @GetMapping(value = "/{id}/organizations")
    public ResponseEntity<List<OrganizationDTO>> queryOrganizations(@PathVariable Long id,
                                                                    @RequestParam(required = false, name = "included_disabled")
                                                                            boolean includedDisabled) {
        return new ResponseEntity<>(userService.queryOrganizations(id, includedDisabled), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询当前用户被分配的所有项目")
    @GetMapping(value = "/{id}/projects")
    public ResponseEntity<List<ProjectDTO>> queryProjects(@PathVariable Long id,
                                                          @RequestParam(required = false, name = "included_disabled")
                                                                  boolean includedDisabled) {
        return new ResponseEntity<>(userService.queryProjects(id, includedDisabled), HttpStatus.OK);
    }

    @ApiIgnore
    @Deprecated
    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询当前用户在某组织下被分配的启用的项目")
    @GetMapping(value = "/{id}/organizations/{organization_id}/projects")
    public ResponseEntity<List<ProjectDTO>> queryProjectsByOrganizationId(@PathVariable Long id,
                                                                          @PathVariable(name = "organization_id") Long organizationId) {
        return new ResponseEntity<>(userService.queryProjectsByOrganizationId(id, organizationId), HttpStatus.OK);
    }

    @ApiIgnore
    @Deprecated
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "查询当前用户被分配的所有组织并带有组织下的项目")
    @GetMapping(value = "/self/organizations_projects")
    public ResponseEntity<List<OrganizationDTO>> queryOrganizationWithProjects() {
        return new ResponseEntity<>(userService.queryOrganizationWithProjects(), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "根据用户登录名获取用户信息")
    @GetMapping
    public ResponseEntity<UserInfoDTO> query(@RequestParam(name = "login_name") String loginName) {
        return Optional.ofNullable(userService.queryByLoginName(loginName))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(() -> new NotFoundException());
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "个人中心更新密码")
    @PutMapping(value = "/{id}/password")
    public ResponseEntity selfUpdatePassword(@PathVariable Long id,
                                             @RequestBody @Valid UserPasswordDTO userPasswordDTO) {
        userService.selfUpdatePassword(id, userPasswordDTO, true);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "用户信息重名校验接口(email/loginName)，新建校验json里面不传id,更新校验传id")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody UserDTO user) {
        userService.check(user);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 在site层查询用户，用户包含拥有的site层的角色
     *
     * @param roleAssignmentSearchDTO 搜索条件
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "在site层查询用户，用户包含拥有的site层的角色")
    @CustomPageRequest
    @PostMapping(value = "/site_level/roles")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersWithSiteLevelRoles(
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
    @ApiOperation(value = "在organization层查询用户，用户包含拥有的organization层的角色")
    @CustomPageRequest
    @PostMapping(value = "/organization_level/roles")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersWithOrganizationLevelRoles(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(name = "source_id") Long sourceId,
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
    @ApiOperation(value = "在project层查询用户，用户包含拥有的project层的角色")
    @CustomPageRequest
    @PostMapping(value = "/project_level/roles")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersWithProjectLevelRoles(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(name = "source_id") Long sourceId,
            @RequestBody(required = false) @Valid RoleAssignmentSearchDTO roleAssignmentSearchDTO
    ) {
        return new ResponseEntity<>(userService.pagingQueryUsersWithProjectLevelRoles(
                pageRequest, roleAssignmentSearchDTO, sourceId), HttpStatus.OK);
    }

    /**
     * 分页查询所有的default用户
     *
     * @param pageRequest 分页信息
     * @return 分页的default用户
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询所有的default用户")
    @CustomPageRequest
    @GetMapping("/default")
    public ResponseEntity<Page<UserDTO>> pagingQueryDefaultUsers(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest) {
        return new ResponseEntity<>(userService.pagingQueryDefaultUsers(pageRequest), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "批量添加default用户")
    @PostMapping("/default")
    public ResponseEntity<Page<UserDTO>> addDefaultUsers(@ModelAttribute("id") long[] ids) {
        userService.addDefaultUsers(ids);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "批量添加default用户")
    @DeleteMapping("/default/{id}")
    public ResponseEntity<Page<UserDTO>> deleteDefaultUser(@PathVariable long id) {
        userService.deleteDefaultUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
