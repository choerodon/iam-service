package io.choerodon.iam.app.service.impl;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Component;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.domain.service.ILdapService;
import io.choerodon.iam.domain.service.impl.ILdapServiceImpl;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncReport;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;
import io.choerodon.iam.infra.dataobject.LdapDO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;

/**
 * @author dengyouquan
 **/
@Component
public class LdapSyncUserQuartzTask {
    private final Logger logger = LoggerFactory.getLogger(LdapSyncUserQuartzTask.class);
    private LdapService ldapService;
    private OrganizationMapper organizationMapper;
    private LdapSyncUserTask ldapSyncUserTask;
    private LdapHistoryRepository ldapHistoryRepository;
    private ILdapService iLdapService;

    public LdapSyncUserQuartzTask(LdapService ldapService, OrganizationMapper organizationMapper,
                                  LdapSyncUserTask ldapSyncUserTask, LdapHistoryRepository ldapHistoryRepository,
                                  ILdapService iLdapService) {
        this.ldapService = ldapService;
        this.organizationMapper = organizationMapper;
        this.ldapSyncUserTask = ldapSyncUserTask;
        this.ldapHistoryRepository = ldapHistoryRepository;
        this.iLdapService = iLdapService;
    }

    @JobTask(maxRetryCount = 2, code = "syncLdapUserSite", params = {
            @JobParam(name = "organizationCode", defaultValue = "hand", description = "组织编码"),
            @JobParam(name = "countLimit", defaultValue = "500", type = Integer.class, description = "同步用户总数")
    }, description = "全局层同步LDAP用户")
    public void syncLdapUserSite(Map<String, Object> map) {
        syncLdapUser(map);
    }

    @JobTask(maxRetryCount = 2, code = "syncLdapUserOrganization", level = ResourceLevel.ORGANIZATION, params = {
            @JobParam(name = "organizationCode", description = "组织编码"),
            @JobParam(name = "countLimit", defaultValue = "500", type = Integer.class, description = "同步用户总数")
    }, description = "组织层同步LDAP用户")
    public void syncLdapUserOrganization(Map<String, Object> map) {
        syncLdapUser(map);
    }

    private void syncLdapUser(Map<String, Object> map) {
        String orgCode = Optional.ofNullable((String) map.get("organizationCode")).orElseThrow(() -> new CommonException("error.syncLdapUser.organizationCodeEmpty"));
        Integer countLimit = Optional.ofNullable((Integer) map.get("countLimit")).orElseThrow(() -> new CommonException("error.syncLdapUser.countLimitEmpty"));
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(orgCode);
        organizationDO = organizationMapper.selectOne(organizationDO);
        Long organizationId = validator(organizationDO);
        Long ldapId = ldapService.queryByOrganizationId(organizationId).getId();
        long startTime = System.currentTimeMillis();
        logger.info("LdapSyncUserQuartzTask starting sync idap user,id:{},organizationId:{}", ldapId, organizationId);
        LdapDO ldap = ldapService.validateLdap(organizationId, ldapId);
        Map<String, Object> returnMap = iLdapService.testConnect(ldap);
        LdapConnectionDTO ldapConnectionDTO =
                (LdapConnectionDTO) returnMap.get(ILdapServiceImpl.LDAP_CONNECTION_DTO);
        if (!ldapConnectionDTO.getCanConnectServer()) {
            throw new CommonException("error.ldap.connect");
        }
        if (!ldapConnectionDTO.getCanLogin()) {
            throw new CommonException("error.ldap.authenticate");
        }
        if (!ldapConnectionDTO.getMatchAttribute()) {
            throw new CommonException("error.ldap.attribute.match");
        }
        LdapTemplate ldapTemplate = (LdapTemplate) returnMap.get(ILdapServiceImpl.LDAP_TEMPLATE);
        CountDownLatch latch = new CountDownLatch(1);
        ldapSyncUserTask.syncLDAPUser(ldapTemplate, ldap, (LdapSyncReport ldapSyncReport, LdapHistoryDO ldapHistoryDO) -> {
            latch.countDown();
            ldapHistoryDO.setSyncEndTime(ldapSyncReport.getEndTime());
            ldapHistoryDO.setNewUserCount(ldapSyncReport.getInsert());
            ldapHistoryDO.setUpdateUserCount(ldapSyncReport.getUpdate());
            ldapHistoryDO.setErrorUserCount(ldapSyncReport.getError());
            return ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDO);
        }, countLimit);
        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
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
