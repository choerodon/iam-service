package io.choerodon.iam.api.controller.v1;

import javax.validation.Valid;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.annotation.Permission;
import io.choerodon.base.constant.PageConstant;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.choerodon.core.base.BaseController;
import io.choerodon.iam.api.validator.ClientValidator;
import io.choerodon.iam.app.service.ClientService;
import io.choerodon.iam.infra.common.utils.ParamUtils;

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
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "创建客户端")
    @PostMapping
    public ResponseEntity<ClientDTO> create(@PathVariable("organization_id") Long organizationId, @RequestBody @Valid ClientDTO clientDTO) {
        clientValidator.create(clientDTO);
        return new ResponseEntity<>(clientService.create(organizationId, clientDTO), HttpStatus.OK);
    }

    /**
     * 构造供创建使用的随机的客户端信息
     *
     * @param organizationId 组织id
     * @return 客户端创建信息
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "随机的客户端创建信息生成")
    @GetMapping(value = "/createInfo")
    public ResponseEntity<ClientDTO> createInfo(@PathVariable("organization_id") Long organizationId) {
        return new ResponseEntity<>(clientService.getDefaultCreatedata(organizationId), HttpStatus.OK);
    }

    /**
     * 根据clientId更新Client
     *
     * @param organizationId 组织id
     * @param clientId       客户端id
     * @param clientDTO      客户端对象
     * @return 更新成功的客户端对象
     */
    @Permission(type = ResourceType.ORGANIZATION)
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
    @Permission(type = ResourceType.ORGANIZATION)
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
    @Permission(type = ResourceType.ORGANIZATION)
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
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "通过名称查询客户端")
    @GetMapping("/query_by_name")
    public ResponseEntity<ClientDTO> queryByName(@PathVariable("organization_id") Long organizationId, @RequestParam(value = "client_name") String clientName) {
        return new ResponseEntity<>(clientService.queryByName(organizationId, clientName), HttpStatus.OK);
    }

    /**
     * 分页模糊查询客户端
     *
     * @param organizationId 组织id
     * @param name           客户端名称
     * @param params         模糊查询参数
     * @return 查询到的客户端分页对象
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "分页模糊查询客户端")
    @GetMapping
    public ResponseEntity<PageInfo<ClientDTO>> list(@PathVariable("organization_id") Long organizationId,
                                                    @RequestParam(defaultValue = PageConstant.PAGE, required = false) final int page,
                                                    @RequestParam(defaultValue = PageConstant.SIZE, required = false) final int size,
                                                    @RequestParam(required = false) String name,
                                                    @RequestParam(required = false) String[] params) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setOrganizationId(organizationId);
        clientDTO.setName(name);

        return new ResponseEntity<>(clientService.list(clientDTO, page,size, ParamUtils.arrToStr(params)), HttpStatus.OK);
    }

    /**
     * 客户端重名校验接口(name)，新建校验不传id,更新校验传id
     *
     * @param organizationId 组织id
     * @param client         客户端对象
     * @return 验证成功，否则失败
     */
    @Permission(type = ResourceType.ORGANIZATION)
    @ApiOperation(value = "客户端信息校验")
    @PostMapping(value = "/check")
    public ResponseEntity check(@PathVariable(name = "organization_id") Long organizationId,
                                @RequestBody ClientDTO client) {
        clientService.check(client);
        return new ResponseEntity(HttpStatus.OK);
    }

}
