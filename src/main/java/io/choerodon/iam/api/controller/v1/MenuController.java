package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.app.service.MenuService;
import io.choerodon.iam.infra.dto.MenuDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 */
@RestController
@RequestMapping("/v1/menus")
public class MenuController {

    private MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("根据id查询目录")
    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> query(@PathVariable("id") Long id) {
        return new ResponseEntity<>(menuService.query(id), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation("获取可以访问的菜单列表")
    @GetMapping
    public ResponseEntity<MenuDTO> menus(@RequestParam String code,
                                         @RequestParam(name = "source_id") Long sourceId) {
        return new ResponseEntity<>(menuService.menus(code, sourceId), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("菜单配置界面根据层级查菜单")
    @GetMapping("/menu_config")
    public ResponseEntity<MenuDTO> menuConfig(@RequestParam String code) {
        return new ResponseEntity<>(menuService.menuConfig(code), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("菜单配置保存")
    @PostMapping("/menu_config")
    public ResponseEntity saveMenuConfig(@RequestParam String code, @RequestBody List<MenuDTO> menus) {
        menuService.saveMenuConfig(code, menus);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("创建目录")
    @PostMapping
    public ResponseEntity<MenuDTO> create(@RequestBody @Valid MenuDTO menuDTO) {
        return new ResponseEntity<>(menuService.create(menuDTO), HttpStatus.OK);
    }

    @PostMapping("/createApp")
    @ApiOperation("创建 Low Code 菜单和权限，仅限内部调用")
    public ResponseEntity createApp(@RequestBody MenuDTO menuDTO) {
        menuService.createApp(menuDTO);
        return ResponseEntity.ok().build();
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("更新目录")
    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> update(@PathVariable("id") Long id,
                                          @RequestBody @Valid MenuDTO menuDTO) {
        return new ResponseEntity<>(menuService.update(id, menuDTO), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation("根据id删除菜单，只能删非默认菜单")
    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable("id") Long id) {
        menuService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "菜单code是否重复")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody MenuDTO menu) {
        menuService.check(menu);
        return new ResponseEntity(HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE, permissionWithin = true)
    @ApiOperation(value = "查询所有菜单")
    @GetMapping(value = "/list")
    public ResponseEntity<List<MenuDTO>> list() {
        return new ResponseEntity<>(menuService.list(), HttpStatus.OK);
    }
}
