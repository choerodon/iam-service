package io.choerodon.iam.app.service;

import io.choerodon.iam.infra.dto.UserDTO;

/**
 * @author superlee
 * @since 0.16.0
 */
public interface UserService {
    /**
     * 从security context中获取当前登录用户的信息
     * @return UserDTO
     */
    UserDTO querySelf();
}
