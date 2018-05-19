package io.choerodon.iam.api.eventhandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import io.choerodon.iam.domain.service.ParsePermissionService;

/**
 * 根据接口解析权限
 *
 * @author superlee
 * @data 2018/4/3
 */
@Component
public class ParsePermissionListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(ParsePermissionListener.class);
    private static final String SWAGGER_TOPIC_NAME = "manager-service";
    private ParsePermissionService parsePermissionService;

    public ParsePermissionListener(ParsePermissionService parsePermissionService) {
        this.parsePermissionService = parsePermissionService;
    }

    @KafkaListener(topics = SWAGGER_TOPIC_NAME)
    public void parse(byte[] bytes) {
        LOGGER.info("### begin to parse message");
        String message = new String(bytes);
        parsePermissionService.parser(message);
    }
}
