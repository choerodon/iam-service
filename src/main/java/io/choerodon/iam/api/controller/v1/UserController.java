package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.NotFoundException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
    @ApiOperation(value = "根据id查询用户信息")
    @GetMapping(value = "/{id}/info")
    public ResponseEntity<UserDTO> queryInfo(@PathVariable Long id) {
        return Optional.ofNullable(userService.queryInfo(id))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(NotFoundException::new);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "修改用户信息")
    @PutMapping(value = "/{id}/info")
    public ResponseEntity<UserDTO> updateInfo(@PathVariable Long id,
                                              @RequestBody UserDTO userDTO) {
        userDTO.setId(id);
        userDTO.updateCheck();
        userDTO.setAdmin(null);
        //不能修改状态
        userDTO.setEnabled(null);
        userDTO.setLdap(null);
        userDTO.setOrganizationId(null);
        userDTO.setLoginName(null);
        return new ResponseEntity<>(userService.updateInfo(userDTO), HttpStatus.OK);
    }

    /**
     * 上传头像到文件服务返回头像url
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "用户头像上传")
    @PostMapping(value = "/{id}/upload_photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id,
                                              @RequestPart MultipartFile file) {
        return new ResponseEntity<>(userService.uploadPhoto(id, file), HttpStatus.OK);
    }

    /**
     * 上传头像，支持裁剪，旋转，并保存
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "用户头像上传裁剪，旋转并保存")
    @PostMapping(value = "/{id}/save_photo")
    public ResponseEntity<String> savePhoto(@PathVariable Long id,
                                            @RequestPart MultipartFile file,
                                            @ApiParam(name = "rotate", value = "顺时针旋转的角度", example = "90")
                                            @RequestParam(required = false) Double rotate,
                                            @ApiParam(name = "startX", value = "裁剪的X轴", example = "100")
                                            @RequestParam(required = false, name = "startX") Integer axisX,
                                            @ApiParam(name = "startY", value = "裁剪的Y轴", example = "100")
                                            @RequestParam(required = false, name = "startY") Integer axisY,
                                            @ApiParam(name = "endX", value = "裁剪的宽度", example = "200")
                                            @RequestParam(required = false, name = "endX") Integer width,
                                            @ApiParam(name = "endY", value = "裁剪的高度", example = "200")
                                            @RequestParam(required = false, name = "endY") Integer height) {
        return new ResponseEntity<>(userService.savePhoto(id, file, rotate, axisX, axisY, width, height), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询用户所在组织列表")
    @GetMapping(value = "/{id}/organizations")
    public ResponseEntity<List<OrganizationDTO>> queryOrganizations(@PathVariable Long id,
                                                                    @RequestParam(required = false, name = "included_disabled")
                                                                            boolean includedDisabled) {
        return new ResponseEntity<>(userService.queryOrganizations(id, includedDisabled), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询用户所在项目列表")
    @GetMapping(value = "/{id}/projects")
    public ResponseEntity<List<ProjectDTO>> queryProjects(@PathVariable Long id,
                                                          @RequestParam(required = false, name = "included_disabled")
                                                                  boolean includedDisabled) {
        return new ResponseEntity<>(userService.queryProjects(id, includedDisabled), HttpStatus.OK);
    }

    /**
     * @deprecated 已过期
     */
    @ApiIgnore
    @Deprecated
    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "查询当前用户在某组织下所在的项目列表")
    @GetMapping(value = "/{id}/organizations/{organization_id}/projects")
    public ResponseEntity<List<ProjectDTO>> queryProjectsByOrganizationId(@PathVariable Long id,
                                                                          @PathVariable(name = "organization_id") Long organizationId) {
        return new ResponseEntity<>(userService.queryProjectsByOrganizationId(id, organizationId), HttpStatus.OK);
    }

    /**
     * @deprecated 已过期
     */
    @ApiIgnore
    @Deprecated
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "查询当前用户所在组织列表以及用户在该组织下所在的项目列表")
    @GetMapping(value = "/self/organizations_projects")
    public ResponseEntity<List<OrganizationDTO>> queryOrganizationWithProjects() {
        return new ResponseEntity<>(userService.queryOrganizationWithProjects(), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "根据用户名查询用户信息")
    @GetMapping
    public ResponseEntity<UserDTO> query(@RequestParam(name = "login_name") String loginName) {
        return Optional.ofNullable(userService.queryByLoginName(loginName))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(NotFoundException::new);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "修改密码")
    @PutMapping(value = "/{id}/password")
    public ResponseEntity selfUpdatePassword(@PathVariable Long id,
                                             @RequestBody @Valid UserPasswordDTO userPasswordDTO) {
        userService.selfUpdatePassword(id, userPasswordDTO, true);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "用户信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody UserDTO user) {
        userService.check(user);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 分页查询所有的admin用户
     *
     * @param pageRequest 分页信息
     * @return 分页的admin用户
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页模糊查询管理员用户列表")
    @CustomPageRequest
    @GetMapping("/admin")
    public ResponseEntity<Page<UserDTO>> pagingQueryAdminUsers(
            @ApiIgnore
            @SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
            @RequestParam(required = false, name = "loginName") String loginName,
            @RequestParam(required = false, name = "realName") String realName,
            @RequestParam(required = false, name = "enabled") Boolean enabled,
            @RequestParam(required = false, name = "locked") Boolean locked,
            @RequestParam(required = false, name = "params") String[] params
    ) {
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        userDO.setRealName(realName);
        userDO.setEnabled(enabled);
        userDO.setLocked(locked);
        return new ResponseEntity<>(userService.pagingQueryAdminUsers(pageRequest, userDO, ParamUtils.arrToStr(params)), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "批量给用户添加管理员身份")
    @PostMapping("/admin")
    public ResponseEntity<Page<UserDTO>> addDefaultUsers(@ModelAttribute("id") long[] ids) {
        userService.addAdminUsers(ids);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "清除用户的管理员身份")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Page<UserDTO>> deleteDefaultUser(@PathVariable long id) {
        userService.deleteAdminUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ApiOperation(value = "批量查询用户信息列表")
    @PostMapping(value = "/ids")
    public ResponseEntity<List<UserDTO>> listUsersByIds(@RequestBody Long[] ids) {
        return new ResponseEntity<>(userService.listUsersByIds(ids), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation("根据id获取组织列表和角色")
    @GetMapping("/{id}/organization_roles")
    public ResponseEntity<List<OrganizationWithRoleDTO>> listOrganizationAndRoleById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(userService.listOrganizationAndRoleById(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation("根据id获取项目列表和角色")
    @GetMapping("/{id}/project_roles")
    public ResponseEntity<List<ProjectWithRoleDTO>> listProjectAndRoleById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(userService.listProjectAndRoleById(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation("根据角色id查看角色对应的权限")
    @GetMapping("/{id}/roles")
    public ResponseEntity<List<PermissionDTO>> listPermissionById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(userService.listPermissionById(id), HttpStatus.OK);
    }
}
