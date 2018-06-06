package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LookupDTO;
import io.choerodon.iam.app.service.LookupService;
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
@RequestMapping(value = "/v1/lookups")
public class LookupController extends BaseController {

    private LookupService lookupService;

    public LookupController(LookupService lookupService) {
        this.lookupService = lookupService;
    }

    /**
     * 创建lookupCode
     *
     * @param lookupDTO 需要创建的lookupDTO对象
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "创建快码")
    @PostMapping
    public ResponseEntity<LookupDTO> create(@RequestBody @Valid LookupDTO lookupDTO) {
        lookupDTO.setId(null);
        return new ResponseEntity<>(lookupService.create(lookupDTO), HttpStatus.OK);
    }

    /**
     * 删除lookupType
     *
     * @param id lookup id
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "删除快码")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        lookupService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "修改快码")
    @PutMapping(value = "/{id}")
    public ResponseEntity<LookupDTO> update(@PathVariable Long id,
                                            @RequestBody @Valid LookupDTO lookupDTO) {
        if (lookupDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.lookup.objectVersionNumber.empty");
        }
        lookupDTO.setId(id);
        return new ResponseEntity<>(lookupService.update(lookupDTO), HttpStatus.OK);
    }

    /**
     * 分页查询lookupType 数据
     *
     * @param pageRequest 分页封装对象
     * @param lookupDTO   查询封装对象
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "分页查询快码")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<LookupDTO>> list(@ApiIgnore
                                                @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                        PageRequest pageRequest,
                                                LookupDTO lookupDTO) {
        return new ResponseEntity<>(lookupService.pagingQuery(pageRequest, lookupDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "通过code查询快码")
    @GetMapping(value = "/code")
    public ResponseEntity<LookupDTO> listByCode(@RequestParam(name = "value") String code) {
        return new ResponseEntity<>(lookupService.listByCodeWithLookupValues(code), HttpStatus.OK);
    }

    /**
     * 查看lookupCode
     *
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "通过id查询快码")
    @GetMapping(value = "/{id}")
    public ResponseEntity<LookupDTO> queryById(@PathVariable Long id) {
        return new ResponseEntity<>(lookupService.queryById(id), HttpStatus.OK);
    }


}
