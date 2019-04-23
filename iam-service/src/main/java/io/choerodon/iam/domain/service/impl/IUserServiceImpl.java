package io.choerodon.iam.domain.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import io.choerodon.iam.infra.dto.UserDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.notify.NoticeSendDTO;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.feign.NotifyFeignClient;
import io.choerodon.mybatis.service.BaseServiceImpl;

/**
 * @author superlee
 * @data 2018/4/12
 */
@Service
public class IUserServiceImpl extends BaseServiceImpl<UserDTO> implements IUserService {

    private UserRepository userRepository;
    private NotifyFeignClient notifyFeignClient;
    private static final Logger logger = LoggerFactory.getLogger(IUserServiceImpl.class);

    public IUserServiceImpl(UserRepository userRepository, NotifyFeignClient notifyFeignClient) {
        this.userRepository = userRepository;
        this.notifyFeignClient = notifyFeignClient;
    }

    @Override
    public UserDTO updateUserEnabled(Long userId) {
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        if (userDTO == null) {
            throw new CommonException("error.user.not.exist");
        }
        userDTO.setEnabled(true);
        return userRepository.updateSelective(userDTO);
    }

    @Override
    public UserDTO updateUserDisabled(Long userId) {
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        if (userDTO == null) {
            throw new CommonException("error.user.not.exist");
        }
        userDTO.setEnabled(false);
        return userRepository.updateSelective(userDTO);
    }


    @Override
    public UserDTO updateUserInfo(UserDTO userDTO) {
        return userRepository.updateUserInfo(userDTO);
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
        logger.info("ready : send Notice to {} users", userIds.size());
        if (userIds == null || userIds.isEmpty()) {
            return new AsyncResult<>("userId is null");
        }
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
                UserDTO userDTO = userRepository.selectByPrimaryKey(id);
                if (userDTO != null) {
                    //有角色分配，但是角色已经删除
                    user.setEmail(userDTO.getEmail());
                    users.add(user);
                }
            } else {
                users.add(user);
            }
        });
        noticeSendDTO.setTargetUsers(users);
        logger.info("start : send Notice to {} users", userIds.size());
        notifyFeignClient.postNotice(noticeSendDTO);
        logger.info("end : send Notice to {} users",userIds.size());
        return new AsyncResult<>((System.currentTimeMillis() - beginTime) / 1000 + "s");
    }
}
