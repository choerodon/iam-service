package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ProjectTypeDTO;
import io.choerodon.iam.api.service.ProjectTypeService;
import io.choerodon.swagger.annotation.Permission;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/projects/types")
public class ProjectTypeController {

    private ProjectTypeService projectTypeService;

    public ProjectTypeController(ProjectTypeService projectTypeService) {
        this.projectTypeService = projectTypeService;
    }

    public void setProjectTypeService(ProjectTypeService projectTypeService) {
        this.projectTypeService = projectTypeService;
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @GetMapping
    public List<ProjectTypeDTO> list() {
      return projectTypeService.list();
    }

 }
