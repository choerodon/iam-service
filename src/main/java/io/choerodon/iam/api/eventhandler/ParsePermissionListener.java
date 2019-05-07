package io.choerodon.iam.api.eventhandler;

import io.choerodon.eureka.event.AbstractEurekaEventObserver;
import io.choerodon.eureka.event.EurekaEventPayload;
import io.choerodon.iam.domain.service.ParsePermissionService;
import org.springframework.stereotype.Component;

/**
 * 根据接口解析权限
 *
 * @author superlee
 */
@Component
public class ParsePermissionListener extends AbstractEurekaEventObserver {

    private ParsePermissionService parsePermissionService;

    public ParsePermissionListener(ParsePermissionService parsePermissionService) {
        this.parsePermissionService = parsePermissionService;
    }

    @Override
    public void receiveUpEvent(EurekaEventPayload payload) {
        //parsePermissionService.parser(payload);
    }

    @Override
    public void receiveDownEvent(EurekaEventPayload payload) {
        // do nothing
    }
}
