package io.choerodon.iam.domain.oauth.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.ClientDTO;
import io.choerodon.iam.domain.oauth.entity.ClientE;
import io.choerodon.iam.infra.dataobject.ClientDO;

/**
 * @author wuguokai
 */
@Component
public class ClientConverter implements ConvertorI<ClientE, ClientDO, ClientDTO> {
    @Override
    public ClientE dtoToEntity(ClientDTO dto) {
        ClientE clientE = new ClientE();
        BeanUtils.copyProperties(dto, clientE);
        return clientE;
    }

    @Override
    public ClientDTO entityToDto(ClientE entity) {
        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(entity, clientDTO);
        return clientDTO;
    }

    @Override
    public ClientE doToEntity(ClientDO dataObject) {
        ClientE clientE = new ClientE();
        BeanUtils.copyProperties(dataObject, clientE);
        return clientE;
    }

    @Override
    public ClientDO entityToDo(ClientE entity) {
        ClientDO clientDO = new ClientDO();
        BeanUtils.copyProperties(entity, clientDO);
        return clientDO;
    }

    @Override
    public ClientDTO doToDto(ClientDO dataObject) {
        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(dataObject, clientDTO);
        return clientDTO;
    }

    @Override
    public ClientDO dtoToDo(ClientDTO dto) {
        ClientDO clientDO = new ClientDO();
        BeanUtils.copyProperties(dto, clientDO);
        return clientDO;
    }
}
