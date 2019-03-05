package io.choerodon.iam.api.controller.v1;

import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.iam.InitRoleCode;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.api.dto.RelationshipEnableCheckDTO;
import io.choerodon.iam.app.service.ProjectRelationshipService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author Eugen
 */
@RestController
@RequestMapping(value = "/v1/project_relation")
public class ProjectRelationshipController {

    private ProjectRelationshipService projectRelationshipService;

    public ProjectRelationshipController(ProjectRelationshipService projectRelationshipService) {
        this.projectRelationshipService = projectRelationshipService;
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "查询项目群下所有项目")
    @GetMapping(value = "/{parent_id}")
    public ResponseEntity<List<ProjectRelationshipDTO>> getProjUnderGroup(@PathVariable(name = "parent_id") Long id) {
        return new ResponseEntity<>(projectRelationshipService.getProjUnderGroup(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "项目群下移除项目")
    @DeleteMapping("/{relationship_id}")
    public ResponseEntity create(@PathVariable(name = "relationship_id") Long id) {
        projectRelationshipService.removesAProjUnderGroup(id);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "获取敏捷项目的不可用时间")
    @GetMapping("/{project_id}/unavailable/under/{parent_id}")
    public ResponseEntity<List<Map<String, Date>>> getUnavailableTime(@PathVariable(name = "project_id") Long id,
                                                                      @PathVariable(name = "parent_id") Long parentId) {
        return new ResponseEntity<>(projectRelationshipService.getUnavailableTime(id, parentId), HttpStatus.OK);
    }


    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "项目群下批量更新（添加/修改/启停用）子项目")
    @PutMapping
    public ResponseEntity<List<ProjectRelationshipDTO>> create(@RequestBody @Valid List<ProjectRelationshipDTO> projectRelationshipDTOList) {
        return new ResponseEntity<>(projectRelationshipService.batchUpdateRelationShipUnderProgram(projectRelationshipDTOList), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION, roles = {InitRoleCode.ORGANIZATION_ADMINISTRATOR})
    @ApiOperation(value = "校验项目关系能否被启用")
    @GetMapping("/check/{relationship_id}/can_be_enabled")
    public ResponseEntity<RelationshipEnableCheckDTO> checkRelationshipCanBeEnabled(@PathVariable(name = "relationship_id") Long id) {
        return new ResponseEntity<>(projectRelationshipService.checkRelationshipCanBeEnabled(id), HttpStatus.OK);
    }


}
