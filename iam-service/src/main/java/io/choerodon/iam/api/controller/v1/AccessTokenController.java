package io.choerodon.iam.api.controller.v1;

import java.util.List;

import io.choerodon.base.annotation.Permission;
import io.choerodon.base.enums.ResourceType;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.UserAccessTokenDTO;
import io.choerodon.iam.app.service.AccessTokenService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;

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
    public ResponseEntity<Page<UserAccessTokenDTO>> list(@ApiIgnore
                                                         @SortDefault(value = "tokenId", direction = Sort.Direction.ASC) PageRequest pageRequest,
                                                         @RequestParam(value = "clientName", required = false) String clientName,
                                                         @RequestParam(value = "currentToken") String currentToken) {
        return new ResponseEntity<>(accessTokenService.pagingTokensByUserIdAndClient(pageRequest, clientName, currentToken), HttpStatus.OK);
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
