package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.app.service.ExcelService;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.app.service.UploadHistoryService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.dto.UploadHistoryDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/organizations/{organization_id}")
public class OrganizationUserController extends BaseController {

    private OrganizationUserService organizationUserService;

    private UserService userService;

    private ExcelService excelService;
    private UploadHistoryService uploadHistoryService;

    public OrganizationUserController(OrganizationUserService organizationUserService,
                                      UserService userService,
                                      ExcelService excelService,
                                      UploadHistoryService uploadHistoryService) {
        this.organizationUserService = organizationUserService;
        this.userService = userService;
        this.excelService = excelService;
        this.uploadHistoryService = uploadHistoryService;
    }

    /**
     * 新增用户
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "创建用户")
    @PostMapping("/users")
    public ResponseEntity<UserDTO> create(@PathVariable(name = "organization_id") Long organizationId,
                                          @RequestBody @Validated UserDTO userDTO) {
        userDTO.setOrganizationId(organizationId);
        //新增用户不能创建ldap用户
        userDTO.setLdap(false);
        return new ResponseEntity<>(organizationUserService.create(userDTO, true), HttpStatus.OK);
    }

    /**
     * 更新用户
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "修改用户")
    @PutMapping(value = "/users/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable(name = "organization_id") Long organizationId,
                                          @PathVariable Long id,
                                          @RequestBody @Validated UserDTO userDTO) {
        //不能更新admin字段
        userDTO.setAdmin(null);
        //不能更新ldap字段
        userDTO.setLdap(null);
        userDTO.setOrganizationId(organizationId);
        userDTO.setId(id);
        return new ResponseEntity<>(organizationUserService.update(userDTO), HttpStatus.OK);
    }

    /**
     * 更新用户
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "重置用户密码")
    @PutMapping(value = "/users/{id}/reset")
    public ResponseEntity<UserDTO> resetUserPassword(@PathVariable(name = "organization_id") Long organizationId, @PathVariable Long id) {
        return new ResponseEntity<>(organizationUserService.resetUserPassword(organizationId, id), HttpStatus.OK);
    }

    /**
     * 分页查询
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "分页查询用户")
    @PostMapping(value = "/users/search")
    @CustomPageRequest
    public ResponseEntity<PageInfo<UserDTO>> list(@PathVariable(name = "organization_id") Long organizationId,
                                                  @ApiIgnore
                                                  @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                  @RequestBody UserSearchDTO user) {
        user.setOrganizationId(organizationId);
        return new ResponseEntity<>(organizationUserService.pagingQuery(pageRequest, user), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "查询组织下的用户")
    @GetMapping(value = "/users/{id}")
    public ResponseEntity<UserDTO> query(@PathVariable(name = "organization_id") Long organizationId,
                                         @PathVariable Long id) {
        return new ResponseEntity<>(organizationUserService.query(organizationId, id), HttpStatus.OK);
    }

    /**
     * 解锁用户
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "解锁用户")
    @GetMapping(value = "/users/{id}/unlock")
    public ResponseEntity<UserDTO> unlock(@PathVariable(name = "organization_id") Long organizationId,
                                          @PathVariable Long id) {
        return new ResponseEntity<>(organizationUserService.unlock(organizationId, id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "启用用户")
    @PutMapping(value = "/users/{id}/enable")
    public ResponseEntity<UserDTO> enableUser(@PathVariable(name = "organization_id") Long organizationId,
                                              @PathVariable Long id) {
        return new ResponseEntity<>(organizationUserService.enableUser(organizationId, id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "禁用用户")
    @PutMapping(value = "/users/{id}/disable")
    public ResponseEntity<UserDTO> disableUser(@PathVariable(name = "organization_id") Long organizationId,
                                               @PathVariable Long id) {
        return new ResponseEntity<>(organizationUserService.disableUser(organizationId, id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "用户信息重名校验")
    @PostMapping(value = "/users/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody UserDTO user) {
        userService.check(user);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation("从excel里面批量导入用户")
    @PostMapping("/users/batch_import")
    public ResponseEntity importUsersFromExcel(@PathVariable(name = "organization_id") Long id,
                                               @RequestPart MultipartFile file) {
        excelService.importUsers(id, file);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation("下载导入用户的模板文件")
    @GetMapping("/users/download_templates")
    public ResponseEntity<Resource> downloadTemplates(@PathVariable(name = "organization_id") Long id) {
        HttpHeaders headers = excelService.getHttpHeaders();
        Resource resource = excelService.getUserTemplates();
        //excel2007
        return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(resource);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation("查询最新的导入历史")
    @GetMapping("/users/{user_id}/upload/history")
    public ResponseEntity<UploadHistoryDTO> latestHistory(@PathVariable(name = "organization_id") Long organizationId,
                                                          @PathVariable(name = "user_id") Long userId) {
        return new ResponseEntity<>(uploadHistoryService.latestHistory(userId, "user", organizationId, ResourceLevel.ORGANIZATION.value()), HttpStatus.OK);
    }

}
