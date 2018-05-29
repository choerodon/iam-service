package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.exception.NotFoundException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LanguageDTO;
import io.choerodon.iam.app.service.LanguageService;
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
    @Permission(level = ResourceLevel.SITE)
    @ApiOperation(value = "修改 Language")
    @PutMapping(value = "/{id}")
    public ResponseEntity<LanguageDTO> update(@PathVariable Long id,
                                              @RequestBody @Valid LanguageDTO languageDTO) {
        languageDTO.setId(id);
        if (languageDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.language.objectVersionNumber.empty");
        }
        return new ResponseEntity<>(languageService.update(languageDTO), HttpStatus.OK);
    }

    /**
     * 分页查询 Language
     *
     * @param pageRequest 分页封装对象
     * @param languageDTO 请求参数封装对象
     * @return 返回信息
     */
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "分页查询 Language")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<LanguageDTO>> pagingQuery(@ApiIgnore
                                                         @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                                 PageRequest pageRequest,
                                                         LanguageDTO languageDTO) {
        return new ResponseEntity<>(languageService.pagingQuery(pageRequest, languageDTO), HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
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
    @Permission(level = ResourceLevel.SITE, permissionLogin = true)
    @ApiOperation(value = "根据code查询Language")
    @GetMapping(value = "/code")
    public ResponseEntity<LanguageDTO> queryByCode(@RequestParam(name = "value") String code) {
        LanguageDTO language = new LanguageDTO();
        language.setCode(code);
        return Optional.ofNullable(languageService.queryByCode(language))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(() -> new NotFoundException());
    }
}
