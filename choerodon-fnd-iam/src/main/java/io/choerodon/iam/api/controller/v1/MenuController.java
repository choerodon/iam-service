package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.swagger.annotation.Permission;
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
@RequestMapping("/v1/menus")
public class MenuController {

    private MenuService menuService;

    public MenuController(MenuService menuService)  {
        this.menuService = menuService;
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("根据id查询目录")
    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> query(@PathVariable("id") Long id) {
        return new ResponseEntity<>(menuService.query(id), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("创建目录")
    @PostMapping
    public ResponseEntity<MenuDTO> create(@RequestBody @Valid MenuDTO menuDTO) {
        return new ResponseEntity<>(menuService.create(menuDTO), HttpStatus.OK);
    }

}
