package io.choerodon.iam.api.controller.v1;

import java.util.List;
import java.util.Set;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
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
    @ApiOperation(value = "全局层修改组织")
    @PutMapping(value = "/{organization_id}")
    public ResponseEntity<OrganizationDTO> update(@PathVariable(name = "organization_id") Long id,
                                                  @RequestBody @Valid OrganizationDTO organizationDTO) {
        return new ResponseEntity<>(organizationService.updateOrganization(id, organizationDTO, ResourceLevel.SITE.value(), 0L),
                HttpStatus.OK);
    }

    /**
     * 组织层修改组织信息
     *
     * @return 修改成功后的组织信息
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "组织层修改组织")
    @PutMapping(value = "/{organization_id}/organization_level")
    public ResponseEntity<OrganizationDTO> updateOnOrganizationLevel(@PathVariable(name = "organization_id") Long id,
                                                                     @RequestBody @Valid OrganizationDTO organizationDTO) {
        return new ResponseEntity<>(organizationService.updateOrganization(id, organizationDTO, ResourceLevel.ORGANIZATION.value(), id),
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
    public ResponseEntity<Page<OrganizationDTO>> pagingQuery(@ApiIgnore
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

    @Permission(level = ResourceLevel.SITE, roles = {InitRoleCode.SITE_ADMINISTRATOR})
    @ApiOperation(value = "分页查询所有组织基本信息")
    @CustomPageRequest
    @GetMapping(value = "/all")
    public ResponseEntity<List<OrganizationSimplifyDTO>> getAllOrgs(@ApiIgnore
                                                                    @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                                            PageRequest pageRequest) {
        return new ResponseEntity<>(organizationService.getAllOrgs(pageRequest), HttpStatus.OK);
    }

    /**
     * 根据id集合查询组织
     *
     * @param ids id集合，去重
     * @return 组织集合
     */
    @Permission(permissionWithin = true)
    @ApiOperation(value = "根据id集合查询组织")
    @PostMapping("/ids")
    public ResponseEntity<List<OrganizationDTO>> queryByIds(@RequestBody Set<Long> ids) {
        return new ResponseEntity<>(organizationService.queryByIds(ids), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "启用组织")
    @PutMapping(value = "/{organization_id}/enable")
    public ResponseEntity<OrganizationDTO> enableOrganization(@PathVariable(name = "organization_id") Long id) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationService.enableOrganization(id, userId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "禁用组织")
    @PutMapping(value = "/{organization_id}/disable")
    public ResponseEntity<OrganizationDTO> disableOrganization(@PathVariable(name = "organization_id") Long id) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationService.disableOrganization(id, userId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "组织信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody OrganizationDTO organization) {
        organizationService.check(organization);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 根据organizationId和param模糊查询loginName和realName两列
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "分页模糊查询组织下的用户")
    @CustomPageRequest
    @GetMapping(value = "/{organization_id}/users")
    public ResponseEntity<Page<UserDTO>> pagingQueryUsersOnOrganization(@PathVariable(name = "organization_id") Long id,
                                                                        @ApiIgnore
                                                                        @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                                                PageRequest pageRequest,
                                                                        @RequestParam(required = false, name = "id") Long userId,
                                                                        @RequestParam(required = false) String email,
                                                                        @RequestParam(required = false) String param) {
        return new ResponseEntity<>(organizationService.pagingQueryUsersInOrganization(id, userId, email, pageRequest, param), HttpStatus.OK);
    }
}
