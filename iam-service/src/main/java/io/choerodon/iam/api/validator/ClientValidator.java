package io.choerodon.iam.api.validator;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.infra.common.utils.JsonUtils;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.mapper.ClientMapper;

/**
 * @author wuguokai
 */
@Component
public class ClientValidator {
    private ClientMapper clientMapper;

    public ClientValidator(ClientMapper clientMapper) {
        this.clientMapper = clientMapper;
    }

    /**
     * 创建客户端校验
     *
     * @param clientDTO 校验的客户端对象
     */
    public void create(ClientDTO clientDTO) {
        //校验客户端名称与密钥是否只包含数字、大小写字母
        String regex = "^[a-z0-9A-Z]+$";
        if (!clientDTO.getName().matches(regex)) {
            throw new CommonException("error.client.name.regex");
        }
        if (!clientDTO.getSecret().matches(regex)) {
            throw new CommonException("error.client.secret.regex");
        }
        //校验客户端重名
        ClientDO clientDO = new ClientDO();
        clientDO.setName(clientDTO.getName());
        if (!clientMapper.select(clientDO).isEmpty()) {
            throw new CommonException("error.clientName.exist");
        }
    }

    /**
     * 更新客户端校验
     *
     * @param clientDTO 客户端对象
     * @return 校验之后的客户端对象
     */
    public ClientDTO update(ClientDTO clientDTO) {
        String name = clientDTO.getName();
        if (name == null) {
            throw new CommonException("error.clientName.null");
        }
        Long clientId = clientDTO.getId();
        Long organizationId = clientDTO.getOrganizationId();
        ClientDO existedClient = clientMapper.selectByPrimaryKey(clientId);
        if (existedClient == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (!organizationId.equals(existedClient.getOrganizationId())) {
            throw new CommonException("error.organizationId.not.same");
        }
        ClientDO client = new ClientDO();
        client.setName(name);
        ClientDO clientDO = clientMapper.selectOne(client);
        if (clientDO != null && !clientDO.getId().equals(clientId)) {
            throw new CommonException("error.clientName.exist");
        }
        if (clientDTO.getAdditionalInformation() == null) {
            clientDTO.setAdditionalInformation("{}");
        } else {
            //校验json格式
            if (!JsonUtils.isJSONValid(clientDTO.getAdditionalInformation())) {
                throw new CommonException("error.client.additionalInfo.notJson");
            }
        }
        return clientDTO;
    }
}
