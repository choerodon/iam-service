package io.choerodon.iam.app.service.impl;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncReport;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.naming.ldap.LdapContext;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;

/**
 * @author dengyouquan
 **/
@Component
public class LdapSyncUserQuartzTask {
    private final Logger logger = LoggerFactory.getLogger(LdapSyncUserQuartzTask.class);
    private LdapService ldapService;
    private OrganizationMapper organizationMapper;
    private LdapSyncUserTask ldapSyncUserTask;

    public LdapSyncUserQuartzTask(LdapService ldapService, OrganizationMapper organizationMapper, LdapSyncUserTask ldapSyncUserTask) {
        this.ldapService = ldapService;
        this.organizationMapper = organizationMapper;
        this.ldapSyncUserTask = ldapSyncUserTask;
    }

    @JobTask(maxRetryCount = 2, code = "syncLdapUser", params = {
            @JobParam(name = "organizationCode", defaultValue = "hand", description = "组织编码")
    }, description = "同步idap用户")
    public void syncLdapUser(Map<String, Object> map) {
        String orgCode = Optional.ofNullable((String) map.get("organizationCode")).orElse("hand");
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(orgCode);
        organizationDO = organizationMapper.selectOne(organizationDO);
        Long organizationId = validator(organizationDO);
        Long ldapId = ldapService.queryByOrganizationId(organizationId).getId();
        long startTime = System.currentTimeMillis();
        logger.info("LdapSyncUserQuartzTask starting sync idap user,id:{},organizationId:{}", ldapId, organizationId);
        LdapDO ldap = ldapService.validateLdap(organizationId, ldapId);
        LdapContext ldapContext = ldapService.getLdapContext(ldap);
        CountDownLatch latch = new CountDownLatch(1);
        ldapSyncUserTask.syncLDAPUser(ldapContext, ldap, (LdapSyncReport ldapSyncReport, LdapHistoryDO ldapHistoryDO) -> {
            latch.countDown();
            return null;
        });
        try {
            latch.await();
        } catch (InterruptedException e) {
            throw new CommonException("error.ldapSyncUserTask.countDownLatch", e);
        }
        long entTime = System.currentTimeMillis();
        logger.info("LdapSyncUserQuartzTask sync idap user completed.speed time:{} millisecond", (entTime - startTime));
    }

    private Long validator(OrganizationDO organizationDO) {
        if (organizationDO == null) {
            throw new CommonException("error.ldapSyncUserTask.organizationNotNull");
        }
        if (organizationDO.getId() == null) {
            throw new CommonException("error.ldapSyncUserTask.idNotNull");
        }
        return organizationDO.getId();
    }
}
