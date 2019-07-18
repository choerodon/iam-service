package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.TASK_USER_CREATE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.User.USER_CREATE;

/**
 * @author dengyouquan
 **/
@Component
public class NotifyListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotifyListener.class);
    private static final String ADD_USER = "addUser";
    private final ObjectMapper mapper = new ObjectMapper();

    private UserService userService;

    public NotifyListener(UserService userService) {
        this.userService = userService;
    }

    @SagaTask(code = TASK_USER_CREATE, sagaCode = USER_CREATE, seq = 1, description = "创建用户成功后发送站内信事件")
    public List<UserEventPayload> create(String message) throws IOException {
        JavaType javaType = mapper.getTypeFactory().constructCollectionType(List.class, UserEventPayload.class);
        List<UserEventPayload> payloads = mapper.readValue(message, javaType);
        if (payloads == null || payloads.isEmpty()) {
            throw new CommonException("error.sagaTask.sendPm.payloadsIsEmpty");
        }
        //暂时区分创建单个用户还是批量创建用户（批量创建一条会有问题）
        if (payloads.size() > 1) {
            return payloads;
        }
        //发送通知
        UserEventPayload payload = payloads.get(0);
        List<Long> userIds = new ArrayList<>();
        userIds.add(payload.getFromUserId());
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("addCount", 1);
        //发送的人和接受站内信的人是同一个人
        userService.sendNotice(payload.getFromUserId(), userIds, ADD_USER, paramsMap, payload.getOrganizationId());
        LOGGER.info("NotifyListener create user send station letter.");
        return payloads;
    }
}
