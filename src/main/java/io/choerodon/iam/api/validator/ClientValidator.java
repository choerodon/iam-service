package io.choerodon.iam.api.validator;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
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
        ClientDO clientDO = new ClientDO();
        clientDO.setName(clientDTO.getName());
        if (!clientMapper.select(clientDO).isEmpty()) {
            throw new CommonException("error.clientName.exist");
        }
    }

    /**
     * 更新客户端校验
     *
     * @param orgId     组织id
     * @param clientId  客户端id
     * @param clientDTO 客户端对象
     * @return 校验之后的客户端对象
     */
    public ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO) {
        ClientDO clientDO = clientMapper.selectByPrimaryKey(clientId);
        if (clientDO == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (!orgId.equals(clientDO.getOrganizationId())) {
            throw new CommonException("error.organizationId.not.same");
        }
        if (clientDTO.getName() == null) {
            throw new CommonException("error.clientName.null");
        }
        if (!clientDO.getName().equals(clientDTO.getName())) {
            clientDO = new ClientDO();
            clientDO.setName(clientDTO.getName());
            if (!clientMapper.select(clientDO).isEmpty()) {
                throw new CommonException("error.clientName.exist");
            }
        }
        clientDO.setSecret(clientDTO.getSecret());
        clientDO.setAuthorizedGrantTypes(clientDTO.getAuthorizedGrantTypes());
        clientDO.setAccessTokenValidity(clientDTO.getAccessTokenValidity());
        clientDO.setRefreshTokenValidity(clientDTO.getRefreshTokenValidity());
        clientDO.setWebServerRedirectUri(clientDTO.getWebServerRedirectUri());
        if (clientDTO.getAdditionalInformation() != null && !JsonUtils.isJSONValid(clientDTO.getAdditionalInformation())) {
            throw new CommonException("error.client.additionalInfo.notJson");
        }
        clientDO.setAdditionalInformation(clientDTO.getAdditionalInformation());
        if (clientDO.getAdditionalInformation() == null) {
            clientDO.setAdditionalInformation("{}");
        }
        clientDO.setObjectVersionNumber(clientDTO.getObjectVersionNumber());
        return ConvertHelper.convert(clientDO, ClientDTO.class);
    }
}
