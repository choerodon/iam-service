package io.choerodon.iam.domain.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import io.choerodon.iam.domain.iam.entity.UserE;

/**
 * @author superlee
 * @data 2018/4/12
 */
public interface IUserService {
    UserE updateUserEnabled(Long userId);

    UserE updateUserDisabled(Long userId);

    UserE updateUserInfo(UserE userE);

    /**
     * 异步
     * 向用户发送通知（包括邮件和站内信）
     * @param fromUserId 发送通知的用户
     * @param userIds    接受通知的目标用户
     * @param code       业务code
     * @param params     渲染参数
     * @param sourceId   触发发送通知对应的组织/项目id，如果是site层，可以为0或null
     */
    Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code, Map<String, Object> params, Long sourceId);
}
