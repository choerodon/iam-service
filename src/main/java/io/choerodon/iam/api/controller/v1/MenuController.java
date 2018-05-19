package io.choerodon.iam.api.controller.v1;

import java.util.List;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.api.validator.MenuValidator;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author wuguokai
 * @author superlee
 */
@RestController
@RequestMapping("/v1/menus")
public class MenuController {

    private MenuService menuService;
    private MenuValidator menuValidator;

    public MenuController(MenuService menuService, MenuValidator menuValidator) {
        this.menuService = menuService;
        this.menuValidator = menuValidator;
    }


    @ApiOperation("获取菜单以及菜单下所有权限")
    @Permission(level = ResourceLevel.SITE)
    @GetMapping
    public ResponseEntity<List<MenuDTO>> queryMenusWithPermissions(@RequestParam("with_permissions") Boolean withPermission,
                                                                   @RequestParam(value = "type", required = false) String type,
                                                                   @RequestParam(required = false) String level) {
        if (withPermission) {
            return new ResponseEntity<>(menuService.queryMenusWithPermissions(level, type), HttpStatus.OK);
        }

        return new ResponseEntity<>(menuService.list(level), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("查看目录详情")
    @GetMapping("/{menuId}")
    public ResponseEntity<MenuDTO> query(@PathVariable("menuId") Long menuId) {
        return new ResponseEntity<>(menuService.query(menuId), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("创建目录")
    @PostMapping
    public ResponseEntity<MenuDTO> create(@RequestBody @Valid MenuDTO menuDTO) {
        menuValidator.create(menuDTO);
        return new ResponseEntity<>(menuService.create(menuDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("更新目录内容")
    @PostMapping("/{menuId}")
    public ResponseEntity<MenuDTO> update(@PathVariable("menuId") Long menuId, @RequestBody MenuDTO menuDTO) {
        menuDTO = menuValidator.update(menuId, menuDTO);
        return new ResponseEntity<>(menuService.update(menuId, menuDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("删除目录")
    @DeleteMapping("/{menuId}")
    public ResponseEntity<Boolean> delete(@PathVariable("menuId") Long menuId) {
        menuValidator.delete(menuId);
        return new ResponseEntity<>(menuService.delete(menuId), HttpStatus.OK);
    }

    @Permission(permissionLogin = true)
    @ApiOperation("获取树形菜单")
    @GetMapping("/tree")
    public ResponseEntity<List<MenuDTO>> listTree(@RequestParam(value = "test_permission", required = false) Boolean testPermission, @RequestParam("level") String level) {
        return new ResponseEntity<>(menuService.listTree(testPermission, level), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("保存树形菜单")
    @PostMapping("/tree")
    public ResponseEntity<List<MenuDTO>> saveListTree(@RequestParam("level") String level,
                                                      @RequestBody @Valid ValidList<MenuDTO> menuDTOList) {
        return new ResponseEntity<>(menuService.saveListTree(level, menuDTOList), HttpStatus.OK);
    }
}
