package io.choerodon.iam.api.controller.v1;

import io.choerodon.base.annotation.Permission;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.core.validator.ValidList;
import io.choerodon.iam.app.service.BookMarkService;
import io.choerodon.iam.infra.dto.BookMarkDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * @author dengyouquan
 **/
@RestController
@RequestMapping(value = "/v1/bookmarks")
public class BookMarkController {
    private BookMarkService bookMarkService;

    public BookMarkController(BookMarkService bookMarkService) {
        this.bookMarkService = bookMarkService;
    }

    @Permission(permissionLogin = true)
    @ApiOperation(value = "创建书签")
    @PostMapping
    public ResponseEntity<BookMarkDTO> create(@RequestBody @Valid BookMarkDTO bookMarkDTO) {
        bookMarkDTO.setUserId(DetailsHelper.getUserDetails().getUserId());
        return new ResponseEntity<>(bookMarkService.create(bookMarkDTO), HttpStatus.OK);
    }

    @Permission(permissionLogin = true)
    @ApiOperation(value = "修改客户端")
    @PutMapping
    public ResponseEntity<List<BookMarkDTO>> update(@RequestBody @Validated ValidList<BookMarkDTO> bookMarkDTOS) {
        return new ResponseEntity<>(bookMarkService.updateAll(bookMarkDTOS), HttpStatus.OK);
    }

    @Permission(permissionLogin = true)
    @ApiOperation(value = "删除书签")
    @DeleteMapping(value = "/{id}")
    public void delete(@PathVariable("id") Long id) {
        bookMarkService.delete(id);
    }

    @Permission(permissionLogin = true)
    @ApiOperation(value = "查询当前用户全部书签")
    @GetMapping
    public ResponseEntity<List<BookMarkDTO>> list() {
        return new ResponseEntity<>(bookMarkService.list(), HttpStatus.OK);
    }
}
