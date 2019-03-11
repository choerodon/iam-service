package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.dataobject.ApplicationDO;
import io.choerodon.iam.infra.mapper.ApplicationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Map;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Application.*;

/**
 * @author superlee
 * @since 0.15.0
 */
@Component
public class ApplicationListener {

    private final Logger logger = LoggerFactory.getLogger(ApplicationListener.class);


    private ObjectMapper objectMapper = new ObjectMapper();

    private ApplicationMapper applicationMapper;

    public ApplicationListener(ApplicationMapper applicationMapper) {
        this.applicationMapper = applicationMapper;
    }


    /**
     * devops端创建app失败，发送消息，iam端执行回滚操作，在devops-service后执行
     *
     * @param message
     */
    @SagaTask(code = APP_ROLLBACK, sagaCode = DEVOPS_CREATE_FAILED, seq = 2, description = "devops创建application失败，iam回滚")
    public void rollback(String message) throws IOException {
        Map<String, String> map = objectMapper.readValue(message, new TypeReference<Map<String, String>>() {
        });
        String organizationId = map.get("organizationId");
        String code = map.get("code");
        String projectId = map.getOrDefault("projectId", "0");
        if (StringUtils.isEmpty(organizationId) || StringUtils.isEmpty(code)) {
            throw new CommonException("illegal organization id or code when rollback application, message {}", message);
        }
        ApplicationDO example = new ApplicationDO();
        example
                .setOrganizationId(Long.valueOf(organizationId))
                .setCode(code)
                .setProjectId(Long.valueOf(projectId));

        ApplicationDO applicationDO = applicationMapper.selectOne(example);
        if (applicationDO == null) {
            logger.warn("receive rollback message from devops while the application does not exist," +
                    " organizationId: {}, code: {}, projectId: {}", organizationId, code, projectId);
        } else {
            applicationMapper.deleteByPrimaryKey(applicationDO);
        }
    }
}
