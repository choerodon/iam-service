package io.choerodon.iam.api.controller.v1;

import java.util.List;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.domain.Sort;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.dto.AccessTokenDTO;
import io.choerodon.mybatis.annotation.SortDefault;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.iam.app.service.AccessTokenService;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Eugen
 **/
@RestController
@RequestMapping(value = "/v1/token")
public class AccessTokenController {

    private AccessTokenService accessTokenService;

    public AccessTokenController(AccessTokenService accessTokenService) {
        this.accessTokenService = accessTokenService;
    }

    @Permission(permissionLogin = true, type = ResourceType.SITE)
    @ApiOperation(value = "分页查询当前用户token")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<PageInfo<AccessTokenDTO>> list(@ApiIgnore
                                                         @SortDefault(value = "id", direction = Sort.Direction.DESC) PageRequest pageRequest,
                                                         @RequestParam(value = "clientName", required = false) String clientName,
                                                         @RequestParam(value = "currentToken") String currentToken) {
        return new ResponseEntity<>(accessTokenService.pagedSearch(pageRequest, clientName, currentToken), HttpStatus.OK);
    }

    @Permission(permissionLogin = true, type = ResourceType.SITE)
    @ApiOperation(value = "根据tokenId删除token")
    @DeleteMapping
    public void delete(@RequestParam(name = "tokenId") String tokenId,
                       @RequestParam(value = "currentToken") String currentToken) {
        accessTokenService.delete(tokenId, currentToken);
    }

    @Permission(permissionLogin = true, type = ResourceType.SITE)
    @ApiOperation(value = "根据tokenId列表批量删除token")
    @DeleteMapping("/batch")
    public void deleteList(@RequestBody List<String> tokenIds,
                           @RequestParam(value = "currentToken") String currentToken) {
        accessTokenService.deleteList(tokenIds, currentToken);
    }
}
