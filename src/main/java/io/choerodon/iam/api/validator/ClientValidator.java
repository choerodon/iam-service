package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.infra.common.utils.JsonUtils;
import io.choerodon.iam.infra.dataobject.ClientDO;
import io.choerodon.iam.infra.mapper.ClientMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;

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
        String name = Optional.ofNullable(clientDTO.getName()).orElseThrow(() -> new CommonException("error.clientName.null"));
        Optional.ofNullable(clientMapper.selectByPrimaryKey(clientId))
                .map(c -> {
                    Long organizationId = c.getOrganizationId();
                    if (!orgId.equals(organizationId)) {
                        throw new CommonException("error.organizationId.not.same");
                    }
                    return c;
                })
                .orElseThrow(() -> new CommonException("error.client.not.exist"));
        ClientDO client = new ClientDO();
        client.setName(name);
        if (!clientMapper.select(client).isEmpty()) {
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
        //组织id不能修改
        clientDTO.setOrganizationId(null);
        return clientDTO;
    }
}
