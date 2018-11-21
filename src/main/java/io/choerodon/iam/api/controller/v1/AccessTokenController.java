package io.choerodon.iam.api.controller.v1;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.domain.Page;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.UserAccessTokenDTO;
import io.choerodon.iam.app.service.AccessTokenService;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;

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

    @Permission(permissionLogin = true)
    @ApiOperation(value = "分页查询当前用户token")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<UserAccessTokenDTO>> list(@ApiIgnore
                                                         @SortDefault(value = "tokenId", direction = Sort.Direction.ASC) PageRequest pageRequest,
                                                         @RequestParam(name = "userId", required = false) Long userId,
                                                         @RequestParam(value = "clientName", required = false) String clientName,
                                                         @RequestParam(value = "currentToken", required = false) String currentToken) {
        userId = DetailsHelper.getUserDetails().getUserId();
        return new ResponseEntity<>(accessTokenService.pagingTokensByUserIdAndClient(pageRequest, userId, clientName,currentToken), HttpStatus.OK);
    }

    @Permission(permissionLogin = true)
    @ApiOperation(value = "根据tokenId删除token")
    @DeleteMapping
    public void delete(@RequestParam(name = "tokenId", required = false) String tokenId,
                       @RequestParam(value = "currentToken", required = false) String currentToken) {
        accessTokenService.delete(tokenId,currentToken);
    }
}
