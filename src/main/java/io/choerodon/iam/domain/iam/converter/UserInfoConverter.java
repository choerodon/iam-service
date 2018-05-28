package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.UserInfoDTO;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.infra.dataobject.UserDO;

/**
 * @author superlee
 * @data 2018/4/13
 */
@Component
public class UserInfoConverter implements ConvertorI<UserE, UserDO, UserInfoDTO> {

    @Override
    public UserInfoDTO doToDto(UserDO dataObject) {
        UserInfoDTO userInfo = new UserInfoDTO();
        BeanUtils.copyProperties(dataObject, userInfo);
        return userInfo;
    }

    @Override
    public UserDO dtoToDo(UserInfoDTO dto) {
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(dto, userDO);
        return userDO;
    }

    @Override
    public UserE dtoToEntity(UserInfoDTO dto) {
        return new UserE(dto.getId(), dto.getLoginName(), dto.getEmail(), dto.getRealName(),
                        dto.getPhone(), dto.getImageUrl(), dto.getLanguage(), dto.getTimeZone(),
                        dto.getObjectVersionNumber(), dto.getDefault());
    }

    @Override
    public UserInfoDTO entityToDto(UserE entity) {
        UserInfoDTO userInfo = new UserInfoDTO();
        BeanUtils.copyProperties(entity, userInfo);
        return userInfo;
    }

}
