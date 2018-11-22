package io.choerodon.iam.app.service;

import io.choerodon.core.iam.ResourceLevel;

/**
 * 发送系统/组织公告
 *
 * @author Eugen
 * @since 2018-11-22
 */
public interface SystemNoticesService {
    /**
     * 发送系统公告
     */
    void sendSystemNotification(ResourceLevel sourceType, Long sourceId, String content);
}
