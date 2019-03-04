package io.choerodon.iam.api.controller.v1;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ProjectGroupDTO;
import io.choerodon.iam.app.service.ProjectGroupService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author Eugen
 */
@RestController
@RequestMapping(value = "/v1/project_group")
public class ProjectGroupController {

    private ProjectGroupService projectGroupService;

    public ProjectGroupController(ProjectGroupService projectGroupService) {
        this.projectGroupService = projectGroupService;
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "查询项目群下所有项目")
    @GetMapping(value = "/{parent_id}")
    public ResponseEntity<List<ProjectGroupDTO>> getProjUnderGroup(@PathVariable(name = "parent_id") Long id) {
        return new ResponseEntity<>(projectGroupService.getProjUnderGroup(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "项目群下批量更新（添加/修改/启停用）子项目")
    @PutMapping
    public ResponseEntity<List<ProjectGroupDTO>> create(@RequestBody @Valid List<ProjectGroupDTO> projectGroupDTOList) {
        if (projectGroupDTOList == null || projectGroupDTOList.isEmpty()) {
            throw new CommonException("error.update.group.empty");
        }
        projectGroupDTOList.forEach(projectGroupDTO -> {
            if (projectGroupDTO.getStartDate() == null) {
                projectGroupDTO.setStartDate(new Date());
            }
            if (projectGroupDTO.getStartDate() != null && projectGroupDTO.getEndDate() != null
                    && projectGroupDTO.getEndDate().getTime() < projectGroupDTO.getStartDate().getTime()) {
                throw new CommonException("error.update.project.group.endDate.before.startDate");
            }
        });
        Set<Long> collect = projectGroupDTOList.stream().map(t -> t.getParentId()).collect(Collectors.toSet());
        if (collect.size() != 1) {
            throw new CommonException("error.update.group.project.not.in.same.group");
        }
        return new ResponseEntity<>(projectGroupService.batchUpdateProjsToTheGroup(projectGroupDTOList), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "项目群下移除项目")
    @DeleteMapping("/{group_id}")
    public ResponseEntity create(@PathVariable(name = "group_id") Long groupId) {
        projectGroupService.removesAProjUnderGroup(groupId);
        return new ResponseEntity(HttpStatus.OK);
    }
}
