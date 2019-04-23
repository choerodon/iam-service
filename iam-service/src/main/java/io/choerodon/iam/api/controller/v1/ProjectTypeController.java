package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.Page;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.service.ProjectTypeService;
import io.choerodon.iam.infra.dto.ProjectTypeDTO;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
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

    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @GetMapping
    public List<ProjectTypeDTO> list() {
        return projectTypeService.list();
    }


    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "分页模糊查询项目类型")
    @CustomPageRequest
    @GetMapping(value = "/paging_query")
    public ResponseEntity<Page<ProjectTypeDTO>> pagingQuery(@RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                            @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                            @RequestParam(required = false) String name,
                                                            @RequestParam(required = false) String code,
                                                            @RequestParam(required = false) String param) {
        return new ResponseEntity<>(projectTypeService.pagingQuery(page,size, name, code, param), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "创建项目类型")
    @PostMapping
    public ResponseEntity<ProjectTypeDTO> create(@RequestBody @Valid ProjectTypeDTO projectTypeDTO) {
        return new ResponseEntity<>(projectTypeService.create(projectTypeDTO), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "更新项目类型")
    @PostMapping("/{id}")
    public ResponseEntity<ProjectTypeDTO> update(@PathVariable Long id,
                                                 @RequestBody @Valid ProjectTypeDTO projectTypeDTO) {
        return new ResponseEntity<>(projectTypeService.update(id, projectTypeDTO), HttpStatus.OK);
    }

    /**
     *
     * @param projectTypeDTO
     * @return
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "重名校验")
    @PostMapping("/check")
    public ResponseEntity check(@RequestBody ProjectTypeDTO projectTypeDTO) {
        projectTypeService.check(projectTypeDTO);
        return new ResponseEntity(HttpStatus.OK);
    }


}

