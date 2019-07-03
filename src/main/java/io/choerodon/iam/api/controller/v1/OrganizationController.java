package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.OrgSharesDTO;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;

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
    @Permission(type = ResourceType.SITE)
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
    @Permission(type = ResourceType.ORGANIZATION)
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
    @Permission(type = ResourceType.SITE)
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
    @Permission(type = ResourceType.ORGANIZATION, permissionLogin = true)
    @ApiOperation(value = "组织层根据组织id查询组织，并查询被分配的角色")
    @GetMapping(value = "/{organization_id}/org_level")
    public ResponseEntity<OrganizationDTO> queryOrgLevel(@PathVariable(name = "organization_id") Long id) {
        return new ResponseEntity<>(organizationService.queryOrganizationWithRoleById(id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "分页查询组织")
    @GetMapping
    public ResponseEntity<PageInfo<OrganizationDTO>> pagingQuery(@RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                                 @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                                 @RequestParam(required = false) String name,
                                                                 @RequestParam(required = false) String code,
                                                                 @RequestParam(required = false) Boolean enabled,
                                                                 @RequestParam(required = false) String[] params) {
        OrganizationDTO organization = new OrganizationDTO();
        organization.setName(name);
        organization.setCode(code);
        organization.setEnabled(enabled);
        return new ResponseEntity<>(organizationService.pagingQuery(organization, page, size, ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE, roles = {InitRoleCode.SITE_ADMINISTRATOR})
    @ApiOperation(value = "分页查询所有组织基本信息")
    @GetMapping(value = "/all")
    public ResponseEntity<PageInfo<OrganizationSimplifyDTO>> getAllOrgs(@RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                                        @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size) {
        return new ResponseEntity<>(organizationService.getAllOrgs(page, size), HttpStatus.OK);
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


    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "启用组织")
    @PutMapping(value = "/{organization_id}/enable")
    public ResponseEntity<OrganizationDTO> enableOrganization(@PathVariable(name = "organization_id") Long id) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationService.enableOrganization(id, userId), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "禁用组织")
    @PutMapping(value = "/{organization_id}/disable")
    public ResponseEntity<OrganizationDTO> disableOrganization(@PathVariable(name = "organization_id") Long id) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationService.disableOrganization(id, userId), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "组织信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody OrganizationDTO organization) {
        organizationService.check(organization);
        return new ResponseEntity(HttpStatus.OK);
    }

    /**
     * 根据organizationId和param模糊查询loginName和realName两列
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "分页模糊查询组织下的用户")
    @GetMapping(value = "/{organization_id}/users")
    public ResponseEntity<PageInfo<UserDTO>> pagingQueryUsersOnOrganization(@PathVariable(name = "organization_id") Long id,
                                                                        @RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                                        @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                                        @RequestParam(required = false, name = "id") Long userId,
                                                                        @RequestParam(required = false) String email,
                                                                        @RequestParam(required = false) String param) {
        return new ResponseEntity<>(organizationService.pagingQueryUsersInOrganization(id, userId, email, page, size, param), HttpStatus.OK);
    }

    @CustomPageRequest
    @PostMapping("/specified")
    @Permission(permissionWithin = true)
    @ApiOperation(value = "根据组织Id列表分页查询组织简要信息")
    public ResponseEntity<PageInfo<OrgSharesDTO>> pagingQuery(@SortDefault(value = "id", direction = Sort.Direction.ASC) PageRequest pageRequest,
                                                              @RequestParam(required = false) String name,
                                                              @RequestParam(required = false) String code,
                                                              @RequestParam(required = false) Boolean enabled,
                                                              @RequestParam(required = false) String params,
                                                              @RequestBody Set<Long> orgIds) {
        return new ResponseEntity<>(organizationService.pagingSpecified(orgIds, name, code, enabled, params, pageRequest), HttpStatus.OK);
    }

}
