package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.IconDTO;
import io.choerodon.iam.app.service.IconService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;

/**
 * @author superlee
 */
@RestController
@RequestMapping(value = "/v1/icons")
public class IconController extends BaseController {

    private IconService iconService;

    public IconController(IconService iconService) {
        this.iconService = iconService;
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询icon")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<IconDTO>> list(@ApiIgnore
                                              @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                      PageRequest pageRequest,
                                              @RequestParam(required = false) String code) {
        return new ResponseEntity<>(iconService.pagingQuery(pageRequest, code), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "创建icon")
    @PostMapping
    public ResponseEntity<IconDTO> create(@RequestBody @Valid IconDTO iconDTO) {
        return new ResponseEntity<>(iconService.create(iconDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "删除icon")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        iconService.deleteById(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }
}
