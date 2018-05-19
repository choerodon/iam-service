package io.choerodon.iam.api.controller.v1;

import java.util.Optional;
import javax.validation.Valid;

import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.NotFoundException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.api.validator.ClientValidator;
import io.choerodon.iam.app.service.ClientService;
import io.choerodon.iam.infra.common.utils.ParamsUtil;
import io.choerodon.mybatis.pagehelper.annotation.SortDefault;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.mybatis.pagehelper.domain.Sort;
import io.choerodon.swagger.annotation.CustomPageRequest;
import io.choerodon.swagger.annotation.Permission;

/**
 * @author wuguokai
 */
@RestController
@RequestMapping(value = "/v1/organizations/{organization_id}/clients")
public class ClientController extends BaseController {

    private ClientService clientService;
    private ClientValidator clientValidator;

    public ClientController(ClientService clientService, ClientValidator clientValidator) {
        this.clientService = clientService;
        this.clientValidator = clientValidator;
    }

    /**
     * 创建Client
     *
     * @param clientDTO Client信息
     * @return 创建的Client响应
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "创建Client", notes = "根据Client对象创建Client")
    @PostMapping
    public ResponseEntity<ClientDTO> create(@PathVariable("organization_id") Long organizationId, @RequestBody @Valid ClientDTO clientDTO) {
        clientValidator.create(clientDTO);
        return new ResponseEntity<>(clientService.create(organizationId, clientDTO), HttpStatus.OK);
    }

    /**
     * 更新Client，根据ID
     *
     * @param clientDTO 要更新的Client信息，需要ID
     * @return 更新后的Client信息响应
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "更新Client", notes = "根据Client对象更新Client,Client对象必须包含clientId")
    @PostMapping(value = "/{id}")
    public ResponseEntity<ClientDTO> update(@PathVariable("organization_id") Long organizationId, @PathVariable("id") Long id,
                                            @RequestBody ClientDTO clientDTO) {
        clientDTO = clientValidator.update(organizationId, id, clientDTO);
        return new ResponseEntity<>(clientService.update(organizationId, id, clientDTO), HttpStatus.OK);
    }

    /**
     * 删除Client
     *
     * @param id Client ID
     * @return 成功响应
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "删除Client", notes = "根据ClienId,删除Client对象")
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("organization_id") Long organizationId, @PathVariable("id") Long id) {
        return new ResponseEntity<>(clientService.delete(organizationId, id), HttpStatus.OK);
    }

    /**
     * 根据ClienId,查询Client对象
     *
     * @param id Client ID
     * @return Client对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "查询Client", notes = "根据ClientId,查询Client对象")
    @GetMapping(value = "/{id}")
    public ResponseEntity<ClientDTO> query(@PathVariable("organization_id") Long organizationId, @PathVariable("id") Long id) {
        return Optional.ofNullable(clientService.query(organizationId, id))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(() -> new NotFoundException());
    }

    /**
     * 根据ClienId,查询Client对象
     *
     * @return Client对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "根据客户端名字查询Client", notes = "根据客户端名字查询Client")
    @GetMapping("/query_by_name")
    public ResponseEntity<ClientDTO> queryByName(@PathVariable("organization_id") Long organizationId, @RequestParam(value = "client_name") String clientName) {
        return Optional.ofNullable(clientService.queryByName(organizationId, clientName))
                .map(result -> new ResponseEntity<>(result, HttpStatus.OK))
                .orElseThrow(() -> new NotFoundException());
    }

    /**
     * 分页查询Client
     *
     * @param pageRequest 分页封装对象
     * @return 分页信息响应
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "分页查询Client", notes = "分页查询")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<ClientDTO>> list(@PathVariable("organization_id") Long organizationId,
                                                @ApiIgnore
                                                @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                        PageRequest pageRequest,
                                                @RequestParam(required = false) String name,
                                                @RequestParam(required = false) String params) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setOrganizationId(organizationId);
        clientDTO.setName(name);
        return new ResponseEntity<>(
                clientService.list(clientDTO, pageRequest, ParamsUtil.parseParams(params)),
                HttpStatus.OK);
    }

    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "客户端重名校验接口(name)，新建校验不传id,更新校验传id")
    @PostMapping(value = "/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody ClientDTO client) {
        clientService.check(client);
        return new ResponseEntity(HttpStatus.OK);
    }

}
