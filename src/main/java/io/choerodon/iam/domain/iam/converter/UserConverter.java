package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 * @data 2018/3/26
 */
@Component
public class UserConverter implements ConvertorI<UserE, UserDO, UserDTO> {

    @Override
    public UserE dtoToEntity(UserDTO dto) {
        return new UserE(dto.getId(), dto.getLoginName(), dto.getEmail(),
                dto.getOrganizationId(), dto.getPassword(),
                dto.getRealName(), dto.getPhone(), dto.getImageUrl(), null,
                dto.getLanguage(), dto.getTimeZone(), null, null,
                dto.getEnabled(), dto.getLocked(), dto.getLdap(), null,
                null, dto.getObjectVersionNumber(), dto.getAdmin(),dto.getInternationalTelCode());
    }

    @Override
    public UserDTO entityToDto(UserE entity) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(entity, userDTO);
        return userDTO;
    }

    @Override
    public UserE doToEntity(UserDO dataObject) {
        UserE userE = new UserE(dataObject.getId(), dataObject.getLoginName(), dataObject.getEmail(),
                dataObject.getOrganizationId(), dataObject.getPassword(),
                dataObject.getRealName(), dataObject.getPhone(), dataObject.getImageUrl(),
                dataObject.getProfilePhoto(), dataObject.getLanguage(), dataObject.getTimeZone(),
                dataObject.getLastPasswordUpdatedAt(), dataObject.getLastLoginAt(),
                dataObject.getEnabled(), dataObject.getLocked(), dataObject.getLdap(),
                dataObject.getLockedUntilAt(),
                dataObject.getPasswordAttempt(), dataObject.getObjectVersionNumber(), dataObject.getAdmin(),dataObject.getInternationalTelCode());
        userE.setRoles(ConvertHelper.convertList(dataObject.getRoles(), RoleE.class));
        return userE;
    }

    @Override
    public UserDO entityToDo(UserE entity) {
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(entity, userDO);
        userDO.setRoles(ConvertHelper.convertList(entity.getRoles(), RoleDO.class));
        return userDO;
    }

    @Override
    public UserDTO doToDto(UserDO dataObject) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(dataObject, userDTO);
        return userDTO;
    }

    @Override
    public UserDO dtoToDo(UserDTO dto) {
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(dto, userDO);
        return userDO;
    }

}
