package io.choerodon.iam.api.service.impl;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.app.service.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * @author dengyouquan
 **/
@Component
public class LdapSyncUserQuartzTask {
    private final Logger logger = LoggerFactory.getLogger(LdapSyncUserQuartzTask.class);
    private LdapService ldapService;

    public LdapSyncUserQuartzTask(LdapService ldapService) {
        this.ldapService = ldapService;
    }

    @JobTask(maxRetryCount = 2, code = "syncUser", params = {
            @JobParam(name = "organizationId", type = Long.class),
            @JobParam(name = "userId", type = Long.class)
    })
    public void syncUser(Map<String, Object> map) {
        Long organizationId = map.containsKey("organizationId") ? ((Integer) map.get("organizationId")).longValue() : 1L;
        Long userId = map.containsKey("userId") ? ((Integer) map.get("userId")).longValue() : DetailsHelper.getUserDetails().getUserId();
        validatorId(organizationId, userId);
        logger.info("LdapSyncUserQuartzTask starting sync idap user");
        ldapService.syncLdapUser(organizationId, userId);
        logger.info("LdapSyncUserQuartzTask sync idap user completed");
    }

    private void validatorId(Long organizationId, Long userId) {
        if (organizationId == null || userId == null) {
            throw new CommonException("error.ldapSyncUserTask.idNotNull");
        }
    }
}
