package io.choerodon.iam.api.controller.v1;

import io.choerodon.core.base.BaseController;
import io.choerodon.core.domain.Page;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.api.validator.ClientValidator;
import io.choerodon.iam.app.service.ClientService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
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
     * 根据Client对象创建一个新的客户端
     *
     * @param organizationId 组织id
     * @param clientDTO      客户端对象
     * @return 创建成功的客户端对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "创建客户端")
    @PostMapping
    public ResponseEntity<ClientDTO> create(@PathVariable("organization_id") Long organizationId, @RequestBody @Valid ClientDTO clientDTO) {
        clientValidator.create(clientDTO);
        return new ResponseEntity<>(clientService.create(organizationId, clientDTO), HttpStatus.OK);
    }

    /**
     * 根据clientId更新Client
     *
     * @param organizationId 组织id
     * @param clientId       客户端id
     * @param clientDTO      客户端对象
     * @return 更新成功的客户端对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "修改客户端")
    @PostMapping(value = "/{client_id}")
    public ResponseEntity<ClientDTO> update(@PathVariable("organization_id") Long organizationId, @PathVariable("client_id") Long clientId,
                                            @RequestBody ClientDTO clientDTO) {
        clientDTO.setId(clientId);
        clientDTO.setOrganizationId(organizationId);
        clientDTO = clientValidator.update(clientDTO);
        return new ResponseEntity<>(clientService.update(organizationId, clientId, clientDTO), HttpStatus.OK);
    }

    /**
     * 根据clientId删除客户端
     *
     * @param organizationId 组织id
     * @param clientId       客户端id
     * @return 删除是否成功
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "删除客户端")
    @DeleteMapping(value = "/{client_id}")
    public ResponseEntity<Boolean> delete(@PathVariable("organization_id") Long organizationId, @PathVariable("client_id") Long clientId) {
        return new ResponseEntity<>(clientService.delete(organizationId, clientId), HttpStatus.OK);
    }

    /**
     * 根据ClientId,查询客户端对象
     *
     * @param organizationId 组织id
     * @param clientId       客户端id
     * @return 查询到的客户端对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "通过id查询客户端")
    @GetMapping(value = "/{client_id}")
    public ResponseEntity<ClientDTO> query(@PathVariable("organization_id") Long organizationId, @PathVariable("client_id") Long clientId) {
        return new ResponseEntity<>(clientService.query(organizationId, clientId), HttpStatus.OK);
    }

    /**
     * 根据客户端名称查询Client
     *
     * @param organizationId 组织id
     * @param clientName     客户端名称
     * @return 查询到的客户端对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "通过名称查询客户端")
    @GetMapping("/query_by_name")
    public ResponseEntity<ClientDTO> queryByName(@PathVariable("organization_id") Long organizationId, @RequestParam(value = "client_name") String clientName) {
        return new ResponseEntity<>(clientService.queryByName(organizationId, clientName), HttpStatus.OK);
    }

    /**
     * 分页模糊查询客户端
     *
     * @param organizationId 组织id
     * @param pageRequest    分页对象
     * @param name           客户端名称
     * @param params         模糊查询参数
     * @return 查询到的客户端分页对象
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "分页模糊查询客户端")
    @CustomPageRequest
    @GetMapping
    public ResponseEntity<Page<ClientDTO>> list(@PathVariable("organization_id") Long organizationId,
                                                @ApiIgnore
                                                @SortDefault(value = "id", direction = Sort.Direction.ASC)
                                                        PageRequest pageRequest,
                                                @RequestParam(required = false) String name,
                                                @RequestParam(required = false) String[] params) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setOrganizationId(organizationId);
        clientDTO.setName(name);

        return new ResponseEntity<>(clientService.list(clientDTO, pageRequest, ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    /**
     * 客户端重名校验接口(name)，新建校验不传id,更新校验传id
     *
     * @param organizationId 组织id
     * @param client         客户端对象
     * @return 验证成功，否则失败
     */
    @Permission(level = ResourceLevel.ORGANIZATION)
    @ApiOperation(value = "客户端信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody ClientDTO client) {
        clientService.check(client);
        return new ResponseEntity(HttpStatus.OK);
    }

}
