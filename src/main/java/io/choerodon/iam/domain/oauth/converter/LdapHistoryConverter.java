package io.choerodon.iam.domain.oauth.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LdapHistoryDTO;
import io.choerodon.iam.domain.oauth.entity.LdapHistoryE;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 */
@Component
public class LdapHistoryConverter implements ConvertorI<LdapHistoryE, LdapHistoryDO, LdapHistoryDTO> {
    @Override
    public LdapHistoryE dtoToEntity(LdapHistoryDTO dto) {
        LdapHistoryE ldapHistoryE = new LdapHistoryE();
        BeanUtils.copyProperties(dto, ldapHistoryE);
        return ldapHistoryE;
    }

    @Override
    public LdapHistoryDTO entityToDto(LdapHistoryE entity) {
        LdapHistoryDTO ldapHistoryDTO = new LdapHistoryDTO();
        BeanUtils.copyProperties(entity, ldapHistoryDTO);
        return ldapHistoryDTO;
    }

    @Override
    public LdapHistoryE doToEntity(LdapHistoryDO dataObject) {
        LdapHistoryE ldapHistoryE = new LdapHistoryE();
        BeanUtils.copyProperties(dataObject, ldapHistoryE);
        return ldapHistoryE;
    }

    @Override
    public LdapHistoryDO entityToDo(LdapHistoryE entity) {
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO();
        BeanUtils.copyProperties(entity, ldapHistoryDO);
        return ldapHistoryDO;
    }

    @Override
    public LdapHistoryDTO doToDto(LdapHistoryDO dataObject) {
        LdapHistoryDTO ldapHistoryDTO = new LdapHistoryDTO();
        BeanUtils.copyProperties(dataObject, ldapHistoryDTO);
        return ldapHistoryDTO;
    }

    @Override
    public LdapHistoryDO dtoToDo(LdapHistoryDTO dto) {
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO();
        BeanUtils.copyProperties(dto, ldapHistoryDO);
        return ldapHistoryDO;
    }
}
