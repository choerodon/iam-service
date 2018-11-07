package io.choerodon.iam.domain.service;

import io.choerodon.eureka.event.EurekaEventPayload;

/**
 * @author superlee
 */
public interface ParsePermissionService {

    /**
     * 解析swagger的文档树
     *
     * @param payload 接受的消息
     */
    void parser(EurekaEventPayload payload);

}
