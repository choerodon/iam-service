package io.choerodon.iam.api.eventhandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.dto.payload.OrganizationCreateEventPayload;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.PasswordPolicyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_CREATE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.ORG_CREATE_USER;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.TASK_ORG_CREATE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.User.USER_CREATE;


/**
 * @author wuguokai
 */
@Component
public class OrganizationListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrganizationListener.class);
    private LdapService ldapService;
    private PasswordPolicyService passwordPolicyService;
    private OrganizationService organizationService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${max.errorTime:5}")
    private Integer maxErrorTime;
    @Value("${lock.expireTime:3600}")
    private Integer lockedExpireTime;
    @Value("${max.checkCaptcha:3}")
    private Integer maxCheckCaptcha;
    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;
    private SagaClient sagaClient;

    public OrganizationListener(LdapService ldapService, PasswordPolicyService passwordPolicyService,
                                OrganizationService organizationService, SagaClient sagaClient) {
        this.ldapService = ldapService;
        this.passwordPolicyService = passwordPolicyService;
        this.organizationService = organizationService;
        this.sagaClient = sagaClient;
    }

    @SagaTask(code = TASK_ORG_CREATE, sagaCode = ORG_CREATE, seq = 1, description = "iam接收org服务创建组织事件")
    public OrganizationCreateEventPayload create(String message) throws IOException {
        OrganizationCreateEventPayload organizationEventPayload = mapper.readValue(message, OrganizationCreateEventPayload.class);
        Long orgId = organizationEventPayload.getId();
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
            ldapDTO.setPort("389");
            ldapDTO.setEnabled(true);
            ldapDTO.setUseSSL(false);
            ldapDTO.setObjectClass("person");
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
            passwordPolicyDTO.setMaxCheckCaptcha(maxCheckCaptcha);
            passwordPolicyDTO.setMaxErrorTime(maxErrorTime);
            passwordPolicyDTO.setLockedExpireTime(lockedExpireTime);
            //默认开启登陆安全策略，设置为
            passwordPolicyDTO.setEnableSecurity(true);
            passwordPolicyDTO.setEnableCaptcha(true);
            passwordPolicyDTO.setMaxCheckCaptcha(3);
            passwordPolicyDTO.setEnableLock(true);
            passwordPolicyDTO.setMaxErrorTime(5);
            passwordPolicyDTO.setLockedExpireTime(600);
            passwordPolicyService.create(orgId, passwordPolicyDTO);
        } catch (Exception e) {
            LOGGER.error("create password policy error of organization {}", orgId);
        }
        return organizationEventPayload;
    }

    @SagaTask(code = TASK_ORG_CREATE, sagaCode = ORG_CREATE_USER, seq = 1, description = "iam接收org服务注册组织同时新建了用户的事件")
    public void createUser(String message) throws IOException {
        UserEventPayload userEventPayload = mapper.readValue(message, UserEventPayload.class);
        List<UserEventPayload> payloads = new ArrayList<>();
        payloads.add(userEventPayload);
        if(devopsMessage) {
            String input = mapper.writeValueAsString(payloads);
            sagaClient.startSaga(USER_CREATE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
        }
    }
}
