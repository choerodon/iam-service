package io.choerodon.iam.app.task;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;

import io.choerodon.iam.app.service.impl.LdapServiceImpl;
import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.enums.LdapSyncType;
import io.choerodon.iam.infra.mapper.LdapHistoryMapper;
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
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncReport;
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import org.springframework.util.StringUtils;

/**
 * @author dengyouquan
 **/
@Component
public class LdapSyncUserQuartzTask {
    private final Logger logger = LoggerFactory.getLogger(LdapSyncUserQuartzTask.class);
    private LdapService ldapService;
    private OrganizationMapper organizationMapper;
    private LdapSyncUserTask ldapSyncUserTask;
    private LdapHistoryMapper ldapHistoryMapper;

    private static final String ORGANIZATION_CODE = "organizationCode";

    public LdapSyncUserQuartzTask(LdapService ldapService, OrganizationMapper organizationMapper,
                                  LdapSyncUserTask ldapSyncUserTask,
                                  LdapHistoryMapper ldapHistoryMapper) {
        this.ldapService = ldapService;
        this.organizationMapper = organizationMapper;
        this.ldapSyncUserTask = ldapSyncUserTask;
        this.ldapHistoryMapper = ldapHistoryMapper;
    }

    @JobTask(maxRetryCount = 2, code = "syncLdapUserSite",
            params = {
                    @JobParam(name = ORGANIZATION_CODE, defaultValue = "hand", description = "组织编码")
            }, description = "全局层同步LDAP用户")
    public void syncLdapUserSite(Map<String, Object> map) {
        long startTime = System.currentTimeMillis();
        syncLdapUser(map, "", LdapSyncType.SYNC.value());
        long entTime = System.currentTimeMillis();
        logger.info("Timed Task for syncing users has been completed, total time: {} millisecond", (entTime - startTime));
    }

    @JobTask(maxRetryCount = 2, code = "syncLdapUserOrganization", level = ResourceLevel.ORGANIZATION,
            params = {
                    @JobParam(name = ORGANIZATION_CODE, description = "组织编码")
            }, description = "组织层同步LDAP用户")
    public void syncLdapUserOrganization(Map<String, Object> map) {
        syncLdapUserSite(map);
    }

    @JobTask(maxRetryCount = 2, code = "syncDisabledLdapUserSite",
            params = {
                    @JobParam(name = ORGANIZATION_CODE, defaultValue = "hand", description = "组织编码"),
                    @JobParam(name = "filterStr", defaultValue = "(employeeType=1)", description = "ldap过滤条件")
            },
            description = "全局层过滤并停用LDAP用户")
    public void syncDisabledLdapUserSite(Map<String, Object> map) {
        String filter =
                Optional
                        .ofNullable((String) map.get("filterStr"))
                        .orElseThrow(() -> new CommonException("error.syncLdapUser.filterStrEmpty"));
        long startTime = System.currentTimeMillis();
        syncLdapUser(map, filter, LdapSyncType.DISABLE.value());
        long entTime = System.currentTimeMillis();
        logger.info("Timed Task for disabling users has been completed, total time: {} millisecond", (entTime - startTime));
    }

    @JobTask(maxRetryCount = 2, code = "syncDisabledLdapUserOrg", level = ResourceLevel.ORGANIZATION,
            params = {
                    @JobParam(name = ORGANIZATION_CODE, description = "组织编码"),
                    @JobParam(name = "filterStr", defaultValue = "(employeeType=1)", description = "ldap过滤条件")
            }, description = "组织层过滤并停用LDAP用户")
    public void syncDisabledLdapUserOrg(Map<String, Object> map) {
        syncDisabledLdapUserSite(map);
    }

    private void syncLdapUser(Map<String, Object> map, String filter, String syncType) {
        //获取方法参数
        String orgCode =
                Optional
                        .ofNullable((String) map.get(ORGANIZATION_CODE))
                        .orElseThrow(() -> new CommonException("error.syncLdapUser.organizationCodeEmpty"));
        LdapDTO ldap = getLdapByOrgCode(orgCode);
        if (!StringUtils.isEmpty(filter)) {
            ldap.setCustomFilter(filter);
        }
        //获取测试连接的returnMap 及 测试连接十分成功
        Map<String, Object> returnMap = ldapService.testConnect(ldap);
        validateConnection(returnMap);
        //获取ldapTemplate
        LdapTemplate ldapTemplate = (LdapTemplate) returnMap.get(LdapServiceImpl.LDAP_TEMPLATE);
        CountDownLatch latch = new CountDownLatch(1);
        //开始同步
        ldapSyncUserTask.syncLDAPUser(ldapTemplate, ldap, syncType, (LdapSyncReport ldapSyncReport, LdapHistoryDTO ldapHistoryDTO) -> {
            latch.countDown();
            LdapSyncUserTask.FinishFallback fallback = ldapSyncUserTask.new FinishFallbackImpl(ldapHistoryMapper);
            return fallback.callback(ldapSyncReport, ldapHistoryDTO);
        });
        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new CommonException("error.ldapSyncUserTask.countDownLatch", e);
        }
    }

    /**
     * 获取组织下ldap
     *
     * @param orgCode 组织编码
     * @return ldap
     */
    private LdapDTO getLdapByOrgCode(String orgCode) {
        OrganizationDTO organizationDTO = new OrganizationDTO();
        organizationDTO.setCode(orgCode);
        organizationDTO = organizationMapper.selectOne(organizationDTO);
        if (organizationDTO == null) {
            throw new CommonException("error.ldapSyncUserTask.organizationNotNull");
        }
        Long organizationId = organizationDTO.getId();
        Long ldapId = ldapService.queryByOrganizationId(organizationId).getId();
        logger.info("LdapSyncUserQuartzTask starting sync ldap user,id:{},organizationId:{}", ldapId, organizationId);
        return ldapService.validateLdap(organizationId, ldapId);
    }


    /**
     * 测试ldap连接十分成功
     *
     * @param returnMap ldap连接返回map
     */
    private void validateConnection(Map<String, Object> returnMap) {
        LdapConnectionDTO ldapConnectionDTO =
                (LdapConnectionDTO) returnMap.get(LdapServiceImpl.LDAP_CONNECTION_DTO);
        if (!ldapConnectionDTO.getCanConnectServer()) {
            throw new CommonException("error.ldap.connect");
        }
        if (!ldapConnectionDTO.getCanLogin()) {
            throw new CommonException("error.ldap.authenticate");
        }
        if (!ldapConnectionDTO.getMatchAttribute()) {
            throw new CommonException("error.ldap.attribute.match");
        }
    }
}
