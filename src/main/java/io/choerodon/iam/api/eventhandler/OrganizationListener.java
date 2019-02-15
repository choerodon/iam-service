package io.choerodon.iam.api.eventhandler;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Organization.*;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.choerodon.asgard.saga.annotation.SagaTask;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.ldap.DirectoryType;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.iam.api.dto.PasswordPolicyDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.api.dto.payload.OrganizationCreateEventPayload;
import io.choerodon.iam.api.dto.payload.OrganizationRegisterPayload;
import io.choerodon.iam.app.service.LdapService;
import io.choerodon.iam.app.service.OrganizationService;
import io.choerodon.iam.app.service.PasswordPolicyService;
import io.choerodon.iam.app.service.RoleService;
import io.choerodon.iam.domain.repository.MemberRoleRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.UserMapper;


/**
 * @author wuguokai
 */
@Component
public class OrganizationListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrganizationListener.class);

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    private static final String PROJECT_MEMBER_ROLE_CODE = "role/project/default/project-member";
    private static final String PROJECT_OWNER_LABEL_NAME = "project.owner";

    private PasswordPolicyService passwordPolicyService;
    private MemberRoleRepository memberRoleRepository;
    private OrganizationService organizationService;
    private ProjectMapper projectMapper;
    private IUserService iUserService;
    private LdapService ldapService;
    private RoleService roleService;
    private UserMapper userMapper;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;
    @Value("${lock.expireTime:3600}")
    private Integer lockedExpireTime;
    @Value("${max.checkCaptcha:3}")
    private Integer maxCheckCaptcha;
    @Value("${max.errorTime:5}")
    private Integer maxErrorTime;

    public OrganizationListener(LdapService ldapService, PasswordPolicyService passwordPolicyService,
                                OrganizationService organizationService, IUserService iUserService,
                                ProjectMapper projectMapper, RoleService roleService,
                                MemberRoleRepository memberRoleRepository, UserMapper userMapper) {
        this.passwordPolicyService = passwordPolicyService;
        this.memberRoleRepository = memberRoleRepository;
        this.organizationService = organizationService;
        this.projectMapper = projectMapper;
        this.iUserService = iUserService;
        this.ldapService = ldapService;
        this.roleService = roleService;
        this.userMapper = userMapper;
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

    @SagaTask(code = TASK_ORG_REGISTER, sagaCode = ORG_REGISTER, seq = 0, description = "iam接收org服务注册组织的事件")
    public OrganizationRegisterPayload registerOrganization(String message) throws IOException {
        OrganizationRegisterPayload payload = mapper.readValue(message, OrganizationRegisterPayload.class);
        LOGGER.info("iam register the organization trigger task,payload: {}", payload);
        Long organizationId = payload.getOrganizationId();
        String organizationCode = payload.getOrganizationCode();
        String organizationName = payload.getOrganizationName();
        Long userId = payload.getUserId();
        createLdap(organizationId, organizationName);
        createPasswordPolicy(organizationId, organizationCode, organizationName);
        createProjectAndMember(organizationId, organizationName, userId);
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

    private void createProjectAndMember(Long orgId, String orgName, Long userId) {
        try {
            LOGGER.info("### begin create project of organization {} ", orgId);
            String projectCode = "";
            boolean flagPC = false;
            while (!flagPC) {
                projectCode = "proj-" + generateString(false, 8);
                ProjectDO checkCodeDO = new ProjectDO();
                checkCodeDO.setCode(projectCode);
                ProjectDO projByCode = projectMapper.selectOne(checkCodeDO);
                if (projByCode == null) {
                    flagPC = true;
                }
            }
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("YYYYMMddHHmmss");
            ProjectDO projectDO = new ProjectDO();
            projectDO.setName("公司内销平台");
            projectDO.setType("type/develop-platform");
            projectDO.setOrganizationName(orgName);
            projectDO.setOrganizationId(orgId);
            projectDO.setCode(projectCode);
            projectDO.setEnabled(true);
            projectMapper.insert(projectDO);
            List<Long> roleIds = roleService.queryIdsByLabelNameAndLabelType(PROJECT_OWNER_LABEL_NAME, "role");
            initProjRole(projectDO.getId(), userId, roleIds);
            UserDO userDO = userMapper.selectByPrimaryKey(userId);
            createProjectMember(orgId, projectDO.getId(), userDO.getPassword());
        } catch (Exception e) {
            LOGGER.error("create project error of organizationId: {}, exception: {}", orgId, e);
        }
    }


    private void createProjectMember(Long orgId, Long projectId, String pwd) {
        //创建两个User
        String loginNameA = "";
        boolean flagLNA = false;
        while (!flagLNA) {
            loginNameA = generateString(false, 10);
            UserDO userDO = new UserDO();
            userDO.setLoginName(loginNameA);
            UserDO userByLoginName = userMapper.selectOne(userDO);
            if (userByLoginName == null) {
                flagLNA = true;
            }
        }
        UserDO userA = new UserDO(loginNameA, loginNameA + "@demo.com", orgId, pwd, "项目成员A", true,
                "zh_CN", "CTT", new Date(System.currentTimeMillis()), false);
        userMapper.insert(userA);
        String loginNameB = "";
        boolean flagLNB = false;
        while (!flagLNB) {
            loginNameB = generateString(false, 10);
            UserDO userDO = new UserDO();
            userDO.setLoginName(loginNameB);
            UserDO userByLoginName = userMapper.selectOne(userDO);
            if (userByLoginName == null) {
                flagLNB = true;
            }
        }
        UserDO userB = new UserDO(loginNameB, loginNameB + "@demo.com", orgId, pwd, "项目成员B", true,
                "zh_CN", "CTT", new Date(System.currentTimeMillis()), false);
        userMapper.insert(userB);

        //分配角色
        RoleDTO roleDTO = roleService.queryByCode(PROJECT_MEMBER_ROLE_CODE);
        if (roleDTO != null) {
            List<Long> roleIds = new ArrayList<>();
            roleIds.add(roleDTO.getId());
            initProjRole(projectId, userA.getId(), roleIds);
            initProjRole(projectId, userB.getId(), roleIds);
        }
    }


    private void initProjRole(Long projectId, Long userId, List<Long> roleIds) {
        if (roleIds != null && !roleIds.isEmpty()) {
            roleIds.forEach(roleId -> {
                MemberRoleDO memberRole = new MemberRoleDO();
                memberRole.setRoleId(roleId);
                memberRole.setMemberId(userId);
                memberRole.setMemberType("user");
                memberRole.setSourceId(projectId);
                memberRole.setSourceType(ResourceLevel.PROJECT.value());
                if (memberRoleRepository.selectOne(memberRole) != null) {
                    throw new CommonException("error.memberRole.existed", memberRole.toString());
                }
                memberRoleRepository.insert(memberRole);
            });
        } else {
            throw new CommonException("error.roleIds.empty.by.label", PROJECT_OWNER_LABEL_NAME);
        }
    }

    private String generateString(Boolean isChinese, int length) {
        char[] text = new char[length];
        for (int i = 0; i < length; i++) {
            if (isChinese) {
                text[i] = (char) (0x4e00 + (int) (Math.random() * (0x5ea5 - 0x4ea5 + 1)));
            } else {
                text[i] = ALPHANUMERIC.charAt(new Random().nextInt(ALPHANUMERIC.length()));
            }
        }
        return new String(text);
    }
}
