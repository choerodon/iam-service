package io.choerodon.iam.api.controller.v1;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

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


    /**
     * 获取菜单以及菜单下所有权限
     *
     * @param withPermission 查询到的菜单是否携带permission集合
     * @param type           查询的菜单类型
     * @param level          查询的菜单层级
     * @return 返回的菜单集合
     */
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

    /**
     * 根据菜单id查询详情
     *
     * @param menuId 菜单id
     * @return 菜单对象
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("查看目录详情")
    @GetMapping("/{menu_id}")
    public ResponseEntity<MenuDTO> query(@PathVariable("menu_id") Long menuId) {
        return new ResponseEntity<>(menuService.query(menuId), HttpStatus.OK);
    }

    /**
     * 创建目录
     *
     * @param menuDTO 目录对象
     * @return 创建成功的目录对象
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("创建目录")
    @PostMapping
    public ResponseEntity<MenuDTO> create(@RequestBody @Valid MenuDTO menuDTO) {
        menuValidator.create(menuDTO);
        return new ResponseEntity<>(menuService.create(menuDTO), HttpStatus.OK);
    }

    /**
     * 更新目录详情
     *
     * @param menuId  目录id
     * @param menuDTO 目录对象
     * @return 更新成功的目录对象
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("更新目录内容")
    @PostMapping("/{menu_id}")
    public ResponseEntity<MenuDTO> update(@PathVariable("menu_id") Long menuId, @RequestBody MenuDTO menuDTO) {
        menuDTO = menuValidator.update(menuId, menuDTO);
        return new ResponseEntity<>(menuService.update(menuId, menuDTO), HttpStatus.OK);
    }

    /**
     * 根据id删除目录
     *
     * @param menuId 目录id
     * @return 删除是否成功
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("删除目录")
    @DeleteMapping("/{menu_id}")
    public ResponseEntity<Boolean> delete(@PathVariable("menu_id") Long menuId) {
        menuValidator.delete(menuId);
        return new ResponseEntity<>(menuService.delete(menuId), HttpStatus.OK);
    }

    /**
     * 获取树形菜单
     *
     * @param testPermission 是否获取校验权限之后的菜单树
     * @param level          菜单层级
     * @return 菜单树集合
     */
    @Permission(permissionLogin = true)
    @ApiOperation("获取树形菜单")
    @GetMapping("/tree")
    public ResponseEntity<List<MenuDTO>> listTree(@RequestParam(value = "test_permission", required = false) Boolean testPermission, @RequestParam("level") String level) {
        return new ResponseEntity<>(menuService.listTree(testPermission, level), HttpStatus.OK);
    }

    /**
     * 保存树形菜单
     *
     * @param level       菜单层级
     * @param menuDTOList 需要保存的树形菜单集合
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation("保存树形菜单")
    @PostMapping("/tree")
    public ResponseEntity<List<MenuDTO>> saveListTree(@RequestParam("level") String level,
                                                      @RequestBody @Valid ValidList<MenuDTO> menuDTOList) {
        return new ResponseEntity<>(menuService.saveListTree(level, menuDTOList), HttpStatus.OK);
    }
}
