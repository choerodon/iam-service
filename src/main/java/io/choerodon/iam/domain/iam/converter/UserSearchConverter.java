package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.infra.dataobject.UserDO;

/**
 * @author superlee
 */
@Component
public class UserSearchConverter implements ConvertorI<Object, UserDO, UserSearchDTO> {

    @Override
    public UserDO dtoToDo(UserSearchDTO dto) {
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(dto, userDO);
        return userDO;
    }

}
