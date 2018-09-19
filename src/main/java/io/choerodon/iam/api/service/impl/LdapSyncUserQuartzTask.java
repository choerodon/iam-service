package io.choerodon.iam.api.service.impl;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.LdapService;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * @author dengyouquan
 **/
@Component
public class LdapSyncUserQuartzTask {
    private LdapService ldapService;

    public LdapSyncUserQuartzTask(LdapService ldapService) {
        this.ldapService = ldapService;
    }

    @JobTask(maxRetryCount = 2, code = "syncUser", params = {
            @JobParam(name = "organizationId"),
            @JobParam(name = "userId")
    })
    public void syncUser(Map<String, Object> map) {
        Long organizationId = (Long) map.get("organizationId");
        Long userId = (Long) map.get("userId");
        validatorId(organizationId, userId);
        ldapService.syncLdapUser(organizationId, userId);
    }

    private void validatorId(Long organizationId, Long userId) {
        if(organizationId==null || userId==null){
            throw new CommonException("error.ldapSyncUserTask.idNotNull");
        }
    }
}
