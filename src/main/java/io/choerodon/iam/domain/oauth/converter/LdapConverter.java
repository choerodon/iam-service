package io.choerodon.iam.domain.oauth.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.domain.oauth.entity.LdapE;
import io.choerodon.iam.infra.dataobject.LdapDO;

/**
 * @author wuguokai
 */
@Component
public class LdapConverter implements ConvertorI<LdapE, LdapDO, LdapDTO> {
    @Override
    public LdapE dtoToEntity(LdapDTO dto) {
        return new LdapE(dto.getId(), dto.getName(), dto.getOrganizationId(), dto.getServerAddress(),
                dto.getEncryption(), dto.getStatus(), dto.getBaseDn(),
                dto.getLdapAttributeName(), dto.getDomain(), dto.getDescription(),
                dto.getObjectVersionNumber());
    }

    @Override
    public LdapDTO entityToDto(LdapE entity) {
        LdapDTO ldapDTO = new LdapDTO();
        BeanUtils.copyProperties(entity, ldapDTO);
        return ldapDTO;
    }

    @Override
    public LdapE doToEntity(LdapDO dataObject) {
        return new LdapE(dataObject.getId(), dataObject.getName(), dataObject.getOrganizationId(),
                dataObject.getServerAddress(), dataObject.getEncryption(), dataObject.getStatus(),
                dataObject.getBaseDn(), dataObject.getLdapAttributeName(),
                dataObject.getDomain(), dataObject.getDescription(), dataObject.getObjectVersionNumber());
    }

    @Override
    public LdapDO entityToDo(LdapE entity) {
        LdapDO ldapDO = new LdapDO();
        BeanUtils.copyProperties(entity, ldapDO);
        return ldapDO;
    }

    @Override
    public LdapDTO doToDto(LdapDO dataObject) {
        LdapDTO ldapDTO = new LdapDTO();
        BeanUtils.copyProperties(dataObject, ldapDTO);
        return ldapDTO;
    }

    @Override
    public LdapDO dtoToDo(LdapDTO dto) {
        LdapDO ldapDO = new LdapDO();
        BeanUtils.copyProperties(dto, ldapDO);
        return ldapDO;
    }
}
