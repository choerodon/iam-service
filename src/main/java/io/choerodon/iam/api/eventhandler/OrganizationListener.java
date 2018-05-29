package io.choerodon.iam.api.eventhandler;

import io.choerodon.core.event.EventPayload;
import io.choerodon.core.exception.CommonException;
import io.choerodon.event.consumer.annotation.EventListener;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.dto.payload.OrganizationEventPayload;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.PasswordPolicyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


/**
 * @author wuguokai
 */
@Component
public class OrganizationListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrganizationListener.class);
    private static final String ORGANIZATION_SERVICE_TOPIC = "organization-service";
    private LdapService ldapService;
    private PasswordPolicyService passwordPolicyService;
    private OrganizationService organizationService;

    public OrganizationListener(LdapService ldapService, PasswordPolicyService passwordPolicyService,
                                OrganizationService organizationService) {
        this.ldapService = ldapService;
        this.passwordPolicyService = passwordPolicyService;
        this.organizationService = organizationService;
    }

    @EventListener(topic = ORGANIZATION_SERVICE_TOPIC, businessType = OrganizationEventPayload.CREATE_ORGANIZATION)
    public void create(EventPayload<OrganizationEventPayload> payload) {
        OrganizationEventPayload organizationEventPayload = payload.getData();
        Long orgId = organizationEventPayload.getOrganizationId();
        OrganizationDTO organizationDTO = organizationService.queryOrganizationById(orgId);
        if (organizationDTO == null) {
            throw new CommonException("error.organization.not exist");
        }
        try {
            LOGGER.info("### begin create ldap of organization {} ", orgId);
            LdapDTO ldapDTO = new LdapDTO();
            ldapDTO.setOrganizationId(orgId);
            ldapDTO.setName(organizationDTO.getName());
            ldapDTO.setServerAddress("");
            ldapService.create(orgId, ldapDTO);
        } catch (Exception e) {
            LOGGER.error("create ldap error of organization {}", orgId);
        }
        try {
            LOGGER.info("### begin create password policy of organization {} ", orgId);
            PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO();
            passwordPolicyDTO.setOrganizationId(orgId);
            passwordPolicyDTO.setCode(organizationDTO.getCode());
            passwordPolicyDTO.setName(organizationDTO.getName());
            passwordPolicyService.create(orgId, passwordPolicyDTO);
        } catch (Exception e) {
            LOGGER.error("create password policy error of organization {}", orgId);
        }
    }
}
