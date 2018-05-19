package io.choerodon.iam.domain.service.impl;

import org.springframework.stereotype.Service;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.service.BaseServiceImpl;

/**
 * @author superlee
 * @data 2018/4/12
 */
@Service
public class IUserServiceImpl extends BaseServiceImpl<UserDO> implements IUserService {

    private UserRepository userRepository;

    public IUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserE updateUserEnabled(Long userId) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        userE.enable();
        return userRepository.updateSelective(userE).hiddenPassword();
    }

    @Override
    public UserE updateUserDisabled(Long userId) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        userE.disable();
        return userRepository.updateSelective(userE).hiddenPassword();
    }


    @Override
    public UserE updateUserInfo(UserE userE) {
        return userRepository.updateUserInfo(userE);
    }
}
