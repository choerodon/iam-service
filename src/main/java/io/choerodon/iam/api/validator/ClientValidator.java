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

    public void create(ClientDTO clientDTO) {
        ClientDO clientDO = new ClientDO();
        clientDO.setName(clientDTO.getName());
        if (clientMapper.select(clientDO).size() > 0) {
            throw new CommonException("error.clientName.exist");
        }
    }

    public ClientDTO update(Long orgId, Long clientId, ClientDTO clientDTO) {
        ClientDO clientDO = clientMapper.selectByPrimaryKey(clientId);
        if (clientDO == null) {
            throw new CommonException("error.client.not.exist");
        }
        if (orgId != clientDO.getOrganizationId()) {
            throw new CommonException("error.organizationId.not.same");
        }
        if (clientDTO.getName() == null) {
            throw new CommonException("error.clientName.null");
        }
        if (!clientDO.getName().equals(clientDTO.getName())) {
            clientDO = new ClientDO();
            clientDO.setName(clientDTO.getName());
            if (clientMapper.select(clientDO).size() > 0) {
                throw new CommonException("error.clientName.exist");
            }
        }
        clientDO.setSecret(clientDTO.getSecret());
        clientDO.setAuthorizedGrantTypes(clientDTO.getAuthorizedGrantTypes());
        clientDO.setAccessTokenValidity(clientDTO.getAccessTokenValidity());
        clientDO.setRefreshTokenValidity(clientDTO.getRefreshTokenValidity());
        clientDO.setWebServerRedirectUri(clientDTO.getWebServerRedirectUri());
        if (!JsonUtils.isJSONValid(clientDTO.getAdditionalInformation())) {
            throw new CommonException("error.client.additionalInfo.notJson");
        }
        clientDO.setAdditionalInformation(clientDTO.getAdditionalInformation());
        clientDO.setObjectVersionNumber(clientDTO.getObjectVersionNumber());
        return ConvertHelper.convert(clientDO, ClientDTO.class);
    }


}
