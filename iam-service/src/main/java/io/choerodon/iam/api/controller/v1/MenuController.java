package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.api.validator.MenuValidator;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.app.service.MenuService;
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
    private MenuValidator menuValidator;

    public MenuController(MenuService menuService, MenuValidator menuValidator) {
        this.menuService = menuService;
        this.menuValidator = menuValidator;
    }

//    /**
//     * 根据菜单id查询详情
//     *
//     * @param menuId 菜单id
//     * @return 菜单对象
//     */
//    @Permission(type = ResourceType.SITE)
//    @ApiOperation("通过id查询目录")
//    @GetMapping("/{menu_id}")
//    public ResponseEntity<MenuDTO> query(@PathVariable("menu_id") Long menuId) {
//        return new ResponseEntity<>(menuService.query(menuId), HttpStatus.OK);
//    }

//    /**
//     * 创建目录
//     *
//     * @param menuDTO 目录对象
//     * @return 创建成功的目录对象
//     */
//    @Permission(type = ResourceType.SITE)
//    @ApiOperation("创建目录")
//    @PostMapping
//    public ResponseEntity<MenuDTO> create(@RequestBody @Valid MenuDTO menuDTO) {
//        menuValidator.create(menuDTO);
//        return new ResponseEntity<>(menuService.create(menuDTO), HttpStatus.OK);
//    }

//    /**
//     * 更新目录详情
//     *
//     * @param menuId  目录id
//     * @param menuDTO 目录对象
//     * @return 更新成功的目录对象
//     */
//    @Permission(type = ResourceType.SITE)
//    @ApiOperation("修改目录")
//    @PostMapping("/{menu_id:[\\d]+}")
//    public ResponseEntity<MenuDTO> update(@PathVariable("menu_id") Long menuId, @RequestBody MenuDTO menuDTO) {
//        menuDTO = menuValidator.update(menuId, menuDTO);
//        return new ResponseEntity<>(menuService.update(menuId, menuDTO), HttpStatus.OK);
//    }

    /**
     * 根据id删除目录
     *
     * @param menuId 目录id
     * @return 删除是否成功
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation("删除目录")
    @DeleteMapping("/{menu_id}")
    public ResponseEntity<Boolean> delete(@PathVariable("menu_id") Long menuId) {
        menuValidator.delete(menuId);
        return new ResponseEntity<>(menuService.delete(menuId), HttpStatus.OK);
    }

//    /**
//     * 获取树形菜单
//     *
//     * @param level 菜单层级
//     * @return ResponseEntity<List   <   MenuDTO>> 树形菜单结构，每个menu包含自己下面带有的permission
//     */
//    @Permission(permissionLogin = true)
//    @ApiOperation("通过层级获取树形菜单")
//    @GetMapping("/tree")
//    public ResponseEntity<List<MenuDTO>> listTreeMenusWithPermissions(
//            @RequestParam(required = false, name = "test_permission") boolean testPermission,
//            @RequestParam String level) {
//        ResourceLevelValidator.validate(level);
//        return new ResponseEntity<>(menuService.listTreeMenusWithPermissions(testPermission, level), HttpStatus.OK);
//    }

//    /**
//     * @param level 菜单层级
//     * @return ResponseEntity<List<MenuDTO>> 返回当前用户经过权限校验的菜单栏，不包含permissions
//     */
//    @Permission(permissionLogin = true)
//    @ApiOperation("通过层级获取已经经过权限校验的左侧菜单")
//    @GetMapping
//    public ResponseEntity<List<MenuDTO>> listAfterTestPermission(@RequestParam String level,
//                                                                 @RequestParam(required = false, name = "source_id") Long sourceId) {
//        ResourceLevelValidator.validate(level);
//        return new ResponseEntity<>(menuService.listAfterTestPermission(level, sourceId), HttpStatus.OK);
//    }

//    /**
//     * 保存树形菜单
//     *
//     * @param level       菜单层级
//     * @param menuDTOList 需要保存的树形菜单集合
//     */
//    @Permission(type = ResourceType.SITE)
//    @ApiOperation("修改树形菜单")
//    @PostMapping("/tree")
//    public ResponseEntity<List<MenuDTO>> saveListTree(@RequestParam("level") String level,
//                                                      @RequestBody @Valid ValidList<MenuDTO> menuDTOList) {
//        return new ResponseEntity<>(menuService.saveListTree(level, menuDTOList), HttpStatus.OK);
//    }

    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "菜单code重名校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@RequestBody MenuDTO menu) {
        menuService.check(menu);
        return new ResponseEntity(HttpStatus.OK);
    }
}
