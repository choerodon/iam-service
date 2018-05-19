package io.choerodon.iam.domain.service;

import io.choerodon.iam.domain.iam.entity.UserE;

/**
 * @author superlee
 * @data 2018/4/12
 */
public interface IUserService {
    UserE updateUserEnabled(Long userId);

    UserE updateUserDisabled(Long userId);

    UserE updateUserInfo(UserE userE);
}
