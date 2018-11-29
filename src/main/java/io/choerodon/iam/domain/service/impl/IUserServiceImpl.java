package io.choerodon.iam.domain.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.notify.NoticeSendDTO;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.feign.NotifyFeignClient;
import io.choerodon.mybatis.service.BaseServiceImpl;

/**
 * @author superlee
 * @data 2018/4/12
 */
@Service
public class IUserServiceImpl extends BaseServiceImpl<UserDO> implements IUserService {

    private UserRepository userRepository;
    private NotifyFeignClient notifyFeignClient;

    public IUserServiceImpl(UserRepository userRepository, NotifyFeignClient notifyFeignClient) {
        this.userRepository = userRepository;
        this.notifyFeignClient = notifyFeignClient;
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

    @Override
    @Async("notify-executor")
    public Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code,
                                     Map<String, Object> params, Long sourceId) {
        return sendNotice(fromUserId, userIds, code, params, sourceId, false);
    }

    @Override
    @Async("notify-executor")
    public Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code, Map<String, Object> params, Long sourceId, boolean sendAll) {
        if (userIds == null || userIds.isEmpty()) return new AsyncResult<>("userId is null");
        long beginTime = System.currentTimeMillis();
        NoticeSendDTO noticeSendDTO = new NoticeSendDTO();
        noticeSendDTO.setCode(code);
        NoticeSendDTO.User currentUser = new NoticeSendDTO.User();
        currentUser.setId(fromUserId);
        noticeSendDTO.setFromUser(currentUser);
        noticeSendDTO.setParams(params);
        noticeSendDTO.setSourceId(sourceId);
        List<NoticeSendDTO.User> users = new LinkedList<>();
        userIds.forEach(id -> {
            NoticeSendDTO.User user = new NoticeSendDTO.User();
            user.setId(id);
            //如果是发送给所有人，我们无需查看是否有角色分配，全部发送，避免查表
            if (!sendAll) {
                UserE userE = userRepository.selectByPrimaryKey(id);
                if (userE != null) {
                    //有角色分配，但是角色已经删除
                    user.setEmail(userE.getEmail());
                    users.add(user);
                }
            } else {
                users.add(user);
            }
        });
        noticeSendDTO.setTargetUsers(users);
        notifyFeignClient.postNotice(noticeSendDTO);
        return new AsyncResult<>((System.currentTimeMillis() - beginTime) / 1000 + "s");
    }
}
