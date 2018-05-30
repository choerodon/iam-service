package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.infra.dataobject.UserDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 * @data 2018/4/13
 */
@Component
public class UserInfoConverter implements ConvertorI<UserE, UserDO, UserDTO> {

    @Override
    public UserDTO doToDto(UserDO dataObject) {
        UserDTO user = new UserDTO();
        BeanUtils.copyProperties(dataObject, user);
        return user;
    }

    @Override
    public UserDO dtoToDo(UserDTO dto) {
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(dto, userDO);
        return userDO;
    }

    @Override
    public UserE dtoToEntity(UserDTO dto) {
        return new UserE(dto.getId(), dto.getLoginName(), dto.getEmail(), dto.getRealName(),
                dto.getPhone(), dto.getImageUrl(), dto.getLanguage(), dto.getTimeZone(),
                dto.getObjectVersionNumber(), dto.getAdmin());
    }

    @Override
    public UserDTO entityToDto(UserE entity) {
        UserDTO user = new UserDTO();
        BeanUtils.copyProperties(entity, user);
        return user;
    }

}
