package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.app.service.OrganizationService;
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

import javax.validation.Valid;

/**
 * @author wuguokai
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/organizations")
public class OrganizationController extends BaseController {

    private OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    /**
     * 修改组织信息
     *
     * @return 修改成功后的组织信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "修改组织")
    @PutMapping(value = "/{organization_id}")
    public ResponseEntity<OrganizationDTO> update(@PathVariable(name = "organization_id") Long id,
                                                  @RequestBody @Valid OrganizationDTO organizationDTO) {
        organizationDTO.setUserId(null);
        return new ResponseEntity<>(organizationService.updateOrganization(id, organizationDTO),
                HttpStatus.OK);
    }

    /**
     * 根据组织id查询组织
     *
     * @param id 所要查询的组织id号
     * @return 组织信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "全局层根据组织id查询组织")
    @GetMapping(value = "/{organization_id}")
    public ResponseEntity<OrganizationDTO> query(@PathVariable(name = "organization_id") Long id) {
        return new ResponseEntity<>(organizationService.queryOrganizationById(id), HttpStatus.OK);
    }

    /**
     * 组织层根据组织id查询组织,附带该用户在该组织分配了那些角色，以及该组织下所有的项目数量
     *
     * @param id 所要查询的组织id号
     * @return 组织信息
     */
    @Permission(level = ResourceLevel.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "组织层根据组织id查询组织，并查询被分配的角色")
    @GetMapping(value = "/{organization_id}/org_level")
    public ResponseEntity<OrganizationDTO> queryOrgLevel(@PathVariable(name = "organization_id") Long id) {
        return new ResponseEntity<>(organizationService.queryOrganizationWithRoleById(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询组织")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<OrganizationDTO>> list(@ApiIgnore
                                                      @SortDefault(value = "id", direction = Sort.Direction.DESC)
                                                              PageRequest pageRequest,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam(required = false) String code,
                                                      @RequestParam(required = false) Boolean enabled,
                                                      @RequestParam(required = false) String[] params) {
        OrganizationDTO organization = new OrganizationDTO();
        organization.setName(name);
        organization.setCode(code);
        organization.setEnabled(enabled);
        return new ResponseEntity<>(organizationService.pagingQuery(organization, pageRequest,
                ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "启用组织")
    @PutMapping(value = "/{organization_id}/enable")
    public ResponseEntity<OrganizationDTO> enableOrganization(@PathVariable(name = "organization_id") Long id) {
        return new ResponseEntity<>(organizationService.enableOrganization(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "禁用组织")
    @PutMapping(value = "/{organization_id}/disable")
    public ResponseEntity<OrganizationDTO> disableOrganization(@PathVariable(name = "organization_id") Long id) {
        return new ResponseEntity<>(organizationService.disableOrganization(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionPublic = true)
    @ApiOperation(value = "组织信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody OrganizationDTO organization) {
        organizationService.check(organization);
        return new ResponseEntity(HttpStatus.OK);
    }

}
