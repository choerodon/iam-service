package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.iam.app.service.LanguageService;
import io.choerodon.iam.infra.dto.LanguageDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.Valid;
import java.util.List;

/**
 * @author superlee
 */
@RestController
@RequestMapping("/v1/languages")
public class LanguageController extends BaseController {

    private LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    /**
     * 修改 Language
     *
     * @return 返回信息
     */
    @Permission(type = ResourceType.SITE)
    @ApiOperation(value = "修改Language")
    @PutMapping(value = "/{id}")
    public ResponseEntity<LanguageDTO> update(@PathVariable Long id,
                                              @RequestBody @Valid LanguageDTO languageDTO) {
        languageDTO.setId(id);
        return ResponseEntity.ok(languageService.update(languageDTO));
    }

    /**
     * 分页查询 Language
     *
     * @param languageDTO 请求参数封装对象
     * @return 返回信息
     */
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation(value = "分页查询Language")
    @GetMapping
    @CustomPageRequest
    public ResponseEntity<PageInfo<LanguageDTO>> pagingQuery(@ApiIgnore
                                                             @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                             LanguageDTO languageDTO,
                                                             @RequestParam(required = false) String param) {
        return ResponseEntity.ok(languageService.pagingQuery(pageRequest, languageDTO, param));
    }

    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation(value = "查询language列表")
    @GetMapping(value = "/list")
    public ResponseEntity<List<LanguageDTO>> listAll() {
        return ResponseEntity.ok(languageService.listAll());
    }


    /**
     * 根据language code单个查询
     *
     * @param code Language
     * @return 返回信息
     */
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation(value = "通过code查询Language")
    @GetMapping(value = "/code")
    public ResponseEntity<LanguageDTO> queryByCode(@RequestParam(name = "value") String code) {
        return ResponseEntity.ok(languageService.queryByCode(code));
    }
}
