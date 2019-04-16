package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.Page;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.api.controller.query.RoleQuery;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author superlee
 * @since 2019-04-15
 */
@RestController
@RequestMapping("/v1/roles")
public class RoleController {

    private RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "分页查询角色")
    @PostMapping(value = "/search")
    public ResponseEntity<Page<RoleDTO>> pagedSearch(@RequestParam(defaultValue = "0") final int page,
                                                     @RequestParam(defaultValue = "10") final int size,
                                                     @RequestBody RoleQuery roleQuery) {
        return new ResponseEntity<>(roleService.pagedSearch(page, size, roleQuery), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "新建角色")
    @PostMapping
    public ResponseEntity<RoleDTO> create(@RequestBody @Valid RoleDTO roleDTO) {
        return new ResponseEntity<>(roleService.create(roleDTO), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "更新角色")
    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> update(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return new ResponseEntity<>(roleService.update(id, roleDTO), HttpStatus.OK);
    }
}
