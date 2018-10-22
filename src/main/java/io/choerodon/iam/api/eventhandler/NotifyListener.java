package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.NoticeSendDTO;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.infra.feign.NotifyFeignClient;
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

    private NotifyFeignClient notifyFeignClient;

    public NotifyListener(NotifyFeignClient notifyFeignClient) {
        this.notifyFeignClient = notifyFeignClient;
    }

    @SagaTask(code = TASK_USER_CREATE, sagaCode = USER_CREATE, seq = 1, description = "创建用户成功后发送站内信事件")
    public List<UserEventPayload> create(String message) throws IOException {
        JavaType javaType = mapper.getTypeFactory().constructCollectionType(List.class, UserEventPayload.class);
        List<UserEventPayload> payloads = mapper.readValue(message, javaType);
        if (payloads == null || payloads.size() == 0) {
            throw new CommonException("error.sagaTask.sendPm.payloadsIsEmpty");
        }
        UserEventPayload payload = payloads.get(0);
        //发送站内信
        NoticeSendDTO noticeSendDTO = new NoticeSendDTO();
        noticeSendDTO.setCode(ADD_USER);
        NoticeSendDTO.User user = new NoticeSendDTO.User();
        user.setId(payload.getFromUserId());
        List<NoticeSendDTO.User> users = new ArrayList<>();
        users.add(user);
        noticeSendDTO.setTargetUsers(users);
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("addCount", 1);
        noticeSendDTO.setParams(paramsMap);
        notifyFeignClient.postNotice(noticeSendDTO);
        LOGGER.info("NotifyListener create user send station letter.");
        return payloads;
    }
}
