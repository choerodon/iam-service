package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dataobject.LdapErrorUserDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 **/
@Component
public class LdapErrorUserConverter implements ConvertorI<Object, LdapErrorUserDO, LdapErrorUserDTO> {

    @Override
    public LdapErrorUserDTO doToDto(LdapErrorUserDO dataObject) {
        LdapErrorUserDTO ldapErrorUserDTO = new LdapErrorUserDTO();
        BeanUtils.copyProperties(dataObject, ldapErrorUserDTO);
        return ldapErrorUserDTO;
    }

    @Override
    public LdapErrorUserDO dtoToDo(LdapErrorUserDTO dto) {
        LdapErrorUserDO ldapErrorUserDO = new LdapErrorUserDO();
        BeanUtils.copyProperties(dto, ldapErrorUserDO);
        return ldapErrorUserDO;
    }
}
