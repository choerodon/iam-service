package io.choerodon.iam.api.controller.v1;

import com.github.pagehelper.Page;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.base.BaseController;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.exception.NotFoundException;
import io.choerodon.iam.app.service.LanguageService;
import io.choerodon.iam.infra.dto.LanguageDTO;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

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
        LanguageDTO language =
                Optional
                        .ofNullable(languageDTO.getObjectVersionNumber())
                        .map(i -> languageService.update(languageDTO))
                        .orElseThrow(() -> new CommonException("error.language.objectVersionNumber.empty"));
        return new ResponseEntity<>(language, HttpStatus.OK);
    }

    /**
     * 分页查询 Language
     *
     * @param pageRequest 分页封装对象
     * @param languageDTO 请求参数封装对象
     * @return 返回信息
     */
    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation(value = "分页查询Language")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<LanguageDTO>> pagingQuery(@RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                         @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                         LanguageDTO languageDTO,
                                                         @RequestParam(required = false)String param) {
        return new ResponseEntity<>(languageService.pagingQuery(page,size, languageDTO,param), HttpStatus.OK);
    }

    @Permission(type = ResourceType.SITE, permissionLogin = true)
    @ApiOperation(value = "查询language列表")
    @GetMapping(value = "/list")
    public ResponseEntity<List<LanguageDTO>> listAll() {
        return new ResponseEntity<>(languageService.listAll(), HttpStatus.OK);
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
        LanguageDTO language = new LanguageDTO();
        language.setCode(code);
        return Optional.ofNullable(languageService.queryByCode(language))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(NotFoundException::new);
    }
}
