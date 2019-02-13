package io.choerodon.iam.api.eventhandler;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.ldap.DirectoryType;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.dto.payload.OrganizationCreateEventPayload;
import io.choerodon.iam.api.dto.payload.OrganizationRegisterPayload;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.domain.service.IUserService;


/**
 * @author wuguokai
 */
@Component
public class OrganizationListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrganizationListener.class);
    private LdapService ldapService;
    private PasswordPolicyService passwordPolicyService;
    private OrganizationService organizationService;
    private IUserService iUserService;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${max.errorTime:5}")
    private Integer maxErrorTime;
    @Value("${lock.expireTime:3600}")
    private Integer lockedExpireTime;
    @Value("${max.checkCaptcha:3}")
    private Integer maxCheckCaptcha;
    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    public OrganizationListener(LdapService ldapService, PasswordPolicyService passwordPolicyService,
                                OrganizationService organizationService, IUserService iUserService) {
        this.ldapService = ldapService;
        this.passwordPolicyService = passwordPolicyService;
        this.organizationService = organizationService;
        this.iUserService = iUserService;
    }

    @SagaTask(code = TASK_ORG_CREATE, sagaCode = ORG_CREATE, seq = 1, description = "iam接收org服务创建组织事件")
    public OrganizationCreateEventPayload create(String message) throws IOException {
        OrganizationCreateEventPayload organizationEventPayload = mapper.readValue(message, OrganizationCreateEventPayload.class);
        LOGGER.info("iam create the organization trigger task,payload: {}", organizationEventPayload);
        Long orgId = organizationEventPayload.getId();
        OrganizationDTO organizationDTO = organizationService.queryOrganizationById(orgId);
        if (organizationDTO == null) {
            throw new CommonException("error.organization.not exist");
        }
        createLdap(orgId, organizationDTO.getName());
        createPasswordPolicy(orgId, organizationDTO.getCode(), organizationDTO.getName());
        return organizationEventPayload;
    }

    private void createPasswordPolicy(Long orgId, String code, String name) {
        try {
            LOGGER.info("### begin create password policy of organization {} ", orgId);
            PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO();
            passwordPolicyDTO.setOrganizationId(orgId);
            passwordPolicyDTO.setCode(code);
            passwordPolicyDTO.setName(name);
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
            LOGGER.error("create password policy error of organizationId: {}, exception: {}", orgId, e);
        }
    }

    private void createLdap(Long orgId, String name) {
        try {
            LOGGER.info("### begin create ldap of organization {} ", orgId);
            LdapDTO ldapDTO = new LdapDTO();
            ldapDTO.setOrganizationId(orgId);
            ldapDTO.setName(name);
            ldapDTO.setServerAddress("");
            ldapDTO.setPort("389");
            ldapDTO.setDirectoryType(DirectoryType.OPEN_LDAP.value());
            ldapDTO.setEnabled(true);
            ldapDTO.setUseSSL(false);
            ldapDTO.setObjectClass("person");
            ldapDTO.setSagaBatchSize(500);
            ldapDTO.setConnectionTimeout(10);
            ldapDTO.setAccount("test");
            ldapDTO.setPassword("test");
            ldapDTO.setUuidField("entryUUID");
            ldapService.create(orgId, ldapDTO);
        } catch (Exception e) {
            LOGGER.error("create ldap error of organization, organizationId: {}, exception: {}", orgId, e);
        }
    }

    @SagaTask(code = TASK_ORG_REGISTER, sagaCode = ORG_REGISTER, seq = 0, description = "iam接收org服务注册组织的事件")
    public OrganizationRegisterPayload registerOrganization(String message) throws IOException {
        OrganizationRegisterPayload payload = mapper.readValue(message, OrganizationRegisterPayload.class);
        LOGGER.info("iam register the organization trigger task,payload: {}", payload);
        Long organizationId = payload.getOrganizationId();
        String organizationCode = payload.getOrganizationCode();
        String organizationName = payload.getOrganizationName();
        createLdap(organizationId, organizationName);
        createPasswordPolicy(organizationId, organizationCode, organizationName);
        //发送邮件——注册组织信息提交
        Long fromUserId = payload.getFromUserId();
        List<Long> userIds = new ArrayList<>();
        userIds.add(payload.getUserId());
        Map<String, Object> params = new HashMap<>();
        params.put("loginName", payload.getLoginName());
        params.put("userName", payload.getRealName());
        params.put("organizationName", payload.getOrganizationName());
        params.put("email", payload.getEmail());
        iUserService.sendNotice(fromUserId, userIds, "registerOrganization-submit", params, 0L);
        return payload;
    }
}
