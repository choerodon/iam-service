package io.choerodon.iam.api.service.impl;

import io.choerodon.asgard.schedule.annotation.JobParam;
import io.choerodon.asgard.schedule.annotation.JobTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
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
    private UserService userService;
    private OrganizationMapper organizationMapper;

    public LdapSyncUserQuartzTask(LdapService ldapService, UserService userService, OrganizationMapper organizationMapper) {
        this.ldapService = ldapService;
        this.userService = userService;
        this.organizationMapper = organizationMapper;
    }

    @JobTask(maxRetryCount = 2, code = "syncUser", params = {
            @JobParam(name = "organizationCode", defaultValue = "hand")
    })
    public void syncUser(Map<String, Object> map) {
        String orgCode = (String) map.get("organizationCode");
        OrganizationDO organizationDO = new OrganizationDO();
        organizationDO.setCode(orgCode);
        organizationDO = organizationMapper.selectOne(organizationDO);
        Long organizationId = validator(organizationDO);
        Long ldapId = ldapService.queryByOrganizationId(organizationId).getId();
        logger.info("LdapSyncUserQuartzTask starting sync idap user,id:{},organizationId:{}", ldapId, organizationId);
        ldapService.syncLdapUser(organizationId, ldapId);
        logger.info("LdapSyncUserQuartzTask sync idap user completed");
    }

    private Long validator(OrganizationDO organizationDO) {
        if (organizationDO == null) {
            throw new CommonException("error.ldapSyncUserTask.idNotNull");
        }
        if (organizationDO.getId() == null) {
            throw new CommonException("error.ldapSyncUserTask.idNotNull");
        }
        UserDTO userDTO = userService.querySelf();
        if (!userDTO.getLdap()) {
            throw new CommonException("error.ldapSyncUserTask.user.notLdapUser");
        }
        return organizationDO.getId();
    }
}
