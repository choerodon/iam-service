package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.ProjectService;
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

/**
 * @author flyleft
 * @date 2018/3/26
 */
@RestController
@RequestMapping(value = "/v1/projects")
public class ProjectController extends BaseController {

    private ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * 按照Id查询项目
     *
     * @param id 要查询的项目ID
     * @return 查询到的项目
     */
    @Permission(level = ResourceLevel.PROJECT)
    @GetMapping(value = "/{project_id}")
    @ApiOperation(value = "通过id查询项目")
    public ResponseEntity<ProjectDTO> query(@PathVariable(name = "project_id") Long id) {
        return new ResponseEntity<>(projectService.queryProjectById(id), HttpStatus.OK);
    }

    /**
     * 根据projectId和param模糊查询loginName和realName两列
     *
     * @param id
     * @param pageRequest
     * @param param
     * @return
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "分页模糊查询项目下的用户")
    @CustomPageRequest
    @GetMapping(value = "/{project_id}/users")
    public ResponseEntity<Page<UserDTO>> list(@PathVariable(name = "project_id") Long id,
                                              @ApiIgnore
                                              @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                      PageRequest pageRequest,
                                              @RequestParam(required = false) String param) {
        return new ResponseEntity<>(projectService.pagingQueryTheUsersOfProject(id, pageRequest, param), HttpStatus.OK);
    }

    /**
     * 项目层更新项目，code和organizationId都不可更改
     *
     * @param id
     * @param projectDTO
     * @return
     */
    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "修改项目")
    @PutMapping(value = "/{project_id}")
    public ResponseEntity<ProjectDTO> update(@PathVariable(name = "project_id") Long id,
                                             @RequestBody ProjectDTO projectDTO) {
        projectDTO.updateCheck();
        projectDTO.setId(id);
        //项目code不可编辑
        projectDTO.setCode(null);
        //组织id不可编辑
        projectDTO.setOrganizationId(null);
        return new ResponseEntity<>(projectService.update(projectDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.PROJECT)
    @ApiOperation(value = "禁用项目")
    @PutMapping(value = "/{project_id}/disable")
    public ResponseEntity<ProjectDTO> disableProject(@PathVariable(name = "project_id") Long id) {
        return new ResponseEntity<>(projectService.disableProject(id), HttpStatus.OK);
    }
}
