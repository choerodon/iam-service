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
    @ApiOperation(value = "创建 Lookup")
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
    @ApiOperation(value = "删除 Lookup")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity delete(@PathVariable Long id) {
        lookupService.delete(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    /**
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "修改 Lookup")
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
    @ApiOperation(value = "分页查询 Lookup 数据")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<LookupDTO>> list(@ApiIgnore
                                                @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                        PageRequest pageRequest,
                                                LookupDTO lookupDTO) {
        return new ResponseEntity<>(lookupService.pagingQuery(pageRequest, lookupDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "根据lookUp的code查询lookup对象包含所有的value")
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
    @ApiOperation(value = "查看 Lookup")
    @GetMapping(value = "/{id}")
    public ResponseEntity<LookupDTO> queryById(@PathVariable Long id) {
        return new ResponseEntity<>(lookupService.queryById(id), HttpStatus.OK);
    }


}
