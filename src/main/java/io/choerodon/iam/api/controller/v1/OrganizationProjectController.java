package io.choerodon.iam.api.controller.v1;

import java.util.List;
import java.util.Map;
import javax.validation.Valid;

import com.github.pagehelper.Page;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.app.service.OrganizationProjectService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.swagger.annotation.CustomPageRequest;

/**
 * @author flyleft
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/organizations/{organization_id}/projects")
public class OrganizationProjectController extends BaseController {

    private OrganizationProjectService organizationProjectService;

    public OrganizationProjectController(OrganizationProjectService organizationProjectService) {
        this.organizationProjectService = organizationProjectService;
    }

    /**
     * 添加项目
     *
     * @param project 项目信息
     * @return 项目信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "创建项目")
    @PostMapping
    public ResponseEntity<ProjectDTO> create(@PathVariable(name = "organization_id") Long organizationId,
                                             @RequestBody @Valid ProjectDTO project) {
        project.setId(null);
        project.setOrganizationId(organizationId);
        return new ResponseEntity<>(organizationProjectService.createProject(project), HttpStatus.OK);
    }

    /**
     * 分页查询项目
     *
     * @param pageRequest 分页请求参数封装对象
     * @return 查询结果
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @GetMapping
    @CustomPageRequest
    @ApiOperation(value = "分页查询项目")
    public ResponseEntity<Page<ProjectDTO>> list(@PathVariable(name = "organization_id") Long organizationId,
                                                 @RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                 @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                 @RequestParam(required = false) String name,
                                                 @RequestParam(required = false) String code,
                                                 @RequestParam(required = false) String typeName,
                                                 @RequestParam(required = false) Boolean enabled,
                                                 @RequestParam(required = false) String category,
                                                 @RequestParam(required = false) String[] params) {
        ProjectDTO project = new ProjectDTO();
        project.setOrganizationId(organizationId);
        project.setName(name);
        project.setCode(code);
        project.setEnabled(enabled);
        project.setTypeName(typeName);
        project.setCategory(category);
        return new ResponseEntity<>(organizationProjectService.pagingQuery(project, page, size, ParamUtils.arrToStr(params)),
                HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @PutMapping(value = "/{project_id}")
    @ApiOperation(value = "修改项目")
    public ResponseEntity<ProjectDTO> update(@PathVariable(name = "organization_id") Long organizationId,
                                             @PathVariable(name = "project_id") Long projectId,
                                             @RequestBody @Valid ProjectDTO projectDTO) {
//        projectDTO.updateCheck();
        projectDTO.setOrganizationId(organizationId);
        projectDTO.setId(projectId);
        //项目code不可编辑
//        projectDTO.setCode(null);
        return new ResponseEntity<>(organizationProjectService.update(organizationId, projectDTO), HttpStatus.OK);

    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "启用项目")
    @PutMapping(value = "/{project_id}/enable")
    public ResponseEntity<ProjectDTO> enableProject(@PathVariable(name = "organization_id") Long organizationId,
                                                    @PathVariable(name = "project_id") Long projectId) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationProjectService.enableProject(organizationId, projectId, userId), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "禁用项目")
    @PutMapping(value = "/{project_id}/disable")
    public ResponseEntity<ProjectDTO> disableProject(@PathVariable(name = "organization_id") Long organizationId,
                                                     @PathVariable(name = "project_id") Long projectId) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(organizationProjectService.disableProject(
                organizationId, projectId, userId), HttpStatus.OK);
    }

    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "项目信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody ProjectDTO projectDTO) {
        projectDTO.setOrganizationId(organizationId);
        organizationProjectService.check(projectDTO);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE, roles = {InitRoleCode.SITE_ADMINISTRATOR})
    @ApiOperation(value = "查询组织下的项目类型及类下项目数及项目")
    @GetMapping("/under_the_type")
    public ResponseEntity<Map<String, Object>> getProjectsByType(@PathVariable(name = "organization_id") Long organizationId) {
        return new ResponseEntity<>(organizationProjectService.getProjectsByType(organizationId), HttpStatus.OK);
    }


    /**
     * @param organizationId 组织Id
     * @param projectId      项目Id
     * @return 组织下的敏捷项目（除去已被该项目群选择的敏捷项目）
     */
    @Permission(type = ResourceType.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "查询项目群下可选的敏捷项目")
    @GetMapping("/{project_id}/agile")
    public ResponseEntity<List<ProjectDTO>> getProjectsNotGroup(@PathVariable(name = "organization_id") Long organizationId,
                                                                @PathVariable(name = "project_id") Long projectId) {
        return new ResponseEntity<>(organizationProjectService.getAvailableAgileProj(organizationId, projectId), HttpStatus.OK);
    }
}
