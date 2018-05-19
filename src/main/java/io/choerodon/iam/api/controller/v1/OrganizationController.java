package io.choerodon.iam.api.controller.v1;

import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.infra.common.utils.ParamsUtil;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;

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
    @ApiOperation(value = "修改目标组织信息")
    @PutMapping(value = "/{id}")
    public ResponseEntity<OrganizationDTO> update(@PathVariable Long id,
                                                  @RequestBody @Valid OrganizationDTO organizationDTO) {
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
    @ApiOperation(value = "根据组织id查询组织")
    @GetMapping(value = "/{id}")
    public ResponseEntity<OrganizationDTO> query(@PathVariable Long id) {
        return new ResponseEntity<>(organizationService.queryOrganizationById(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询所有组织列表")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<OrganizationDTO>> list(@ApiIgnore
                                                      @SortDefault(value = "id", direction = Sort.Direction.DESC)
                                                              PageRequest pageRequest,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam(required = false) String code,
                                                      @RequestParam(required = false) Boolean enabled,
                                                      @RequestParam(required = false) String params) {
        OrganizationDTO organization = new OrganizationDTO();
        organization.setName(name);
        organization.setCode(code);
        organization.setEnabled(enabled);
        return new ResponseEntity<>(organizationService.pagingQuery(organization, pageRequest,
                ParamsUtil.parseParams(params)), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "启用组织")
    @PutMapping(value = "/{id}/enable")
    public ResponseEntity<OrganizationDTO> enableOrganization(@PathVariable Long id) {
        return new ResponseEntity<>(organizationService.enableOrganization(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "禁用组织")
    @PutMapping(value = "/{id}/disable")
    public ResponseEntity<OrganizationDTO> disableOrganization(@PathVariable Long id) {
        return new ResponseEntity<>(organizationService.disableOrganization(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "organization code校验接口，新建校验不传id,更新校验传id")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody OrganizationDTO organization) {
        organizationService.check(organization);
        return new ResponseEntity(HttpStatus.OK);
    }

}
