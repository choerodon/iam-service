package io.choerodon.iam.infra.utils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.mapper.UserMapper;
import org.springframework.stereotype.Component;

/**
 * 断言帮助类
 *
 * @author superlee
 * @since 0.16.0
 */
@Component
public class AssertHelper {

    private UserMapper userMapper;

    public AssertHelper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public UserDTO userNotExisted(Long id) {
        return userNotExisted(id, "error.user.not.exist");
    }

    public UserDTO userNotExisted(Long id, String message) {
        UserDTO dto = userMapper.selectByPrimaryKey(id);
        if (dto == null) {
            throw new CommonException(message, id);
        }
        return dto;
    }
}
