package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * @author Eugen
 */
@RestController
@RequestMapping(value = "/v1/organizations/{organization_id}/roles")
public class OrganizationRoleController extends BaseController {

    private RoleService roleService;

    public OrganizationRoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * 分页查询组织层角色
     *
     * @param organizationId 组织Id
     * @param pageRequest    分页信息
     * @param roleQuery      查询数据
     * @return 分页查询结果
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层分页查询组织层角色（包括该组织创建的角色 及 平台层创建的组织角色）")
    @PostMapping(value = "/paging")
    public ResponseEntity<PageInfo<RoleDTO>> pagingQuery(@PathVariable(name = "organization_id") Long organizationId,
                                                         @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                         @RequestBody RoleQuery roleQuery) {
        roleQuery.setSourceId(organizationId);
        roleQuery.setSourceType(ResourceType.ORGANIZATION.value());
        return new ResponseEntity<>(roleService.pagingQueryOrgRoles(organizationId, pageRequest, roleQuery), HttpStatus.OK);
    }


    /**
     * 组织层通过ID查询角色信息(包括权限信息 和 标签信息)
     *
     * @param id 角色ID
     * @return 查询角色信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层通过ID查询角色信息(包括权限信息 和 标签信息)")
    @GetMapping(value = "/{id}")
    public ResponseEntity<RoleDTO> queryById(@PathVariable(name = "organization_id") Long organizationId,
                                             @PathVariable Long id) {
        return new ResponseEntity<>(roleService.queryWithPermissionsAndLabels(id), HttpStatus.OK);
    }


    /**
     * 组织层创建组织层角色
     *
     * @param organizationId 组织ID
     * @param roleDTO        角色创建信息
     * @return 创建角色结果信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层创建角色")
    @PostMapping
    public ResponseEntity<RoleDTO> create(@PathVariable(name = "organization_id") Long organizationId,
                                          @RequestBody @Validated RoleDTO roleDTO) {
        roleDTO.setLabels(null);
        roleDTO.setResourceLevel(ResourceType.ORGANIZATION.value());
        roleDTO.setOrganizationId(organizationId);
        return new ResponseEntity<>(roleService.create(roleDTO), HttpStatus.OK);
    }

    /**
     * 组织层修改角色
     * 只能修改本组织创建的角色
     *
     * @param organizationId 组织Id
     * @param id             角色id
     * @param roleDTO        修改角色信息
     * @return 修改结果
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层修改角色")
    @PutMapping(value = "/{id}")
    public ResponseEntity<RoleDTO> update(@PathVariable(name = "organization_id") Long organizationId,
                                          @PathVariable Long id,
                                          @RequestBody RoleDTO roleDTO) {
        roleDTO.setId(id);
        roleDTO.setLabels(null);
        return new ResponseEntity<>(roleService.orgUpdate(roleDTO, organizationId), HttpStatus.OK);
    }

    /**
     * 组织层启用角色
     *
     * @param organizationId 组织ID
     * @param id             要启用的角色Id
     * @return 启用角色信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层启用角色")
    @PutMapping(value = "/{id}/enable")
    public ResponseEntity<RoleDTO> enable(@PathVariable(name = "organization_id") Long organizationId,
                                          @PathVariable Long id) {
        return new ResponseEntity<>(roleService.orgEnableRole(id, organizationId), HttpStatus.OK);
    }

    /**
     * 组织层停用角色
     *
     * @param organizationId 组织ID
     * @param id             要停用的角色Id
     * @return 停用角色信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层禁用角色")
    @PutMapping(value = "/{id}/disable")
    public ResponseEntity<RoleDTO> disable(@PathVariable(name = "organization_id") Long organizationId,
                                           @PathVariable Long id) {
        return new ResponseEntity<>(roleService.orgDisableRole(id, organizationId), HttpStatus.OK);
    }

    /**
     * 组织层角色信息校验
     *
     * @param role 角色信息
     * @return 校验结果（如校验通过则不返回数据）
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "组织层角色信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody RoleDTO role) {
        roleService.check(role);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 根据标签查询组织层角色
     *
     * @return 查询结果
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "根据标签查询组织层角色")
    @GetMapping(value = "/selectByLabel")
    public ResponseEntity<List<RoleDTO>> selectByLabel(@PathVariable(name = "organization_id") Long organizationId,
                                                       @RequestParam String label) {
        return ResponseEntity.ok(roleService.selectByLabel(label, organizationId));
    }

}
