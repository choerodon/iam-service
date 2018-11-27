package io.choerodon.iam.app.service.impl;

import java.util.*;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.eventhandler.OrganizationListener;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.app.service.SystemNoticesService;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;

/**
 * 发送系统/组织公告
 *
 * @author Eugen
 * @since 2018-11-22
 */
@Component
public class SystemNoticesServiceImpl implements SystemNoticesService {
    private UserRepository userRepository;
    private IUserService iUserService;
    private OrganizationUserService organizationUserService;
    public static final String ORG_NOTYFICATION_CODE = "organizationNotification";
    public static final String SITE_NOTYFICATION_CODE = "systemNotification";
    private static final Logger logger = LoggerFactory.getLogger(OrganizationListener.class);

    public SystemNoticesServiceImpl(UserRepository userRepository, IUserService iUserService, OrganizationUserService organizationUserService) {
        this.userRepository = userRepository;
        this.iUserService = iUserService;
        this.organizationUserService = organizationUserService;
    }

    /**
     * 系统公告JobTask
     *
     * @param map 参数map
     */
    @JobTask(maxRetryCount = 0, code = "systemNotification", level = ResourceLevel.SITE, params = {
            @JobParam(name = "content", defaultValue = "系统公告", description = "系统公告内容")
    }, description = "平台层发送系统通知")
    public void systemNotification(Map<String, Object> map) {
        String content = Optional.ofNullable((String) map.get("content")).orElseThrow(() -> new CommonException("error.systemNotification.content.empty"));
        sendSystemNotification(ResourceLevel.SITE, 0L, content);
    }

    /**
     * 组织公告JobTask
     *
     * @param map 参数map
     */
    @JobTask(maxRetryCount = 0, code = "organizationNotification", level = ResourceLevel.ORGANIZATION, params = {
            @JobParam(name = "content", defaultValue = "组织公告", description = "组织公告内容"),
            @JobParam(name = "orgId", type = Long.class, description = "组织Id")
    }, description = "组织层发送系统通知")
    public void organizationNotification(Map<String, Object> map) {
        Long orgId = Optional.ofNullable(new Long(map.get("orgId").toString())).orElseThrow(() -> new CommonException("error.organizationNotification.orgId.empty"));
        String content = Optional.ofNullable((String) map.get("content")).orElseThrow(() -> new CommonException("error.organizationNotification.content.empty"));
        sendSystemNotification(ResourceLevel.ORGANIZATION, orgId, content);
    }

    /**
     * 发送组织/系统公告
     *
     * @param sourceType 层级：可为ResourceLevel.SITE 平台层/ResourceLevel.ORGANIZATION 组织层
     * @param sourceId   触发发送通知对应的组织Id，如果是site层，可以为0
     * @param content    发送内容
     */
    @Override
    public void sendSystemNotification(ResourceLevel sourceType, Long sourceId, String content) {
        //发送设置模板
        String code = ResourceLevel.SITE.equals(sourceType) ? SITE_NOTYFICATION_CODE : ORG_NOTYFICATION_CODE;
        //发送对象
        List<Long> allUsersId = new ArrayList<>();
        if (ResourceLevel.ORGANIZATION.equals(sourceType)) {
            allUsersId = organizationUserService.listUserIds(sourceId);
        } else if (ResourceLevel.SITE.equals(sourceType)) {
            allUsersId = Arrays.asList(userRepository.listUserIds());
        }
        //发送人
//        Long createUserId = DetailsHelper.getUserDetails().getUserId();
        //发送内容
        Map<String, Object> params = new HashMap<>();
        params.put("content", content);
        Future<String> future = iUserService.sendNotice(null, allUsersId, code, params, sourceId);
        while (true) {  // 这里使用了循环判断，等待获取结果信息
            try {
                if (future.isDone()) {  // 判断是否执行完毕
                    logger.info("The system notification has been sent out", future.get());
                    break;
                }
                if (future.isCancelled()) {  // 判断是否取消
                    logger.info("The system notification has been cancelled", future.get());
                    break;
                }
                Thread.sleep(2000);
            } catch (Exception e) {
                throw new CommonException("error.send.system.notification,{}", e);
            }
        }
    }

}
