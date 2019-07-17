package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.*;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.asserts.UserAssertHelper;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.SystemSettingDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.exception.InsertException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.UserMapper;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDTO;
import io.choerodon.oauth.core.password.domain.BaseUserDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.api.validator.UserPasswordValidator;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.app.service.SystemSettingService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.enums.LdapErrorUserCause;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import io.choerodon.oauth.core.password.record.PasswordRecord;

/**
 * @author superlee
 */
@Component
@RefreshScope
public class OrganizationUserServiceImpl implements OrganizationUserService {
    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;
    @Value("${spring.application.name:default}")
    private String serviceName;
    private PasswordRecord passwordRecord;
    private SagaClient sagaClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private PasswordPolicyManager passwordPolicyManager;
    private UserPasswordValidator userPasswordValidator;
    private OauthTokenFeignClient oauthTokenFeignClient;
    private BasePasswordPolicyMapper basePasswordPolicyMapper;
    @Value("${choerodon.site.default.password:abcd1234}")
    private String siteDefaultPassword;
    private SystemSettingService systemSettingService;

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private OrganizationAssertHelper organizationAssertHelper;

    private OrganizationMapper organizationMapper;

    private UserAssertHelper userAssertHelper;

    private UserMapper userMapper;

    private UserService userService;

    public OrganizationUserServiceImpl(PasswordRecord passwordRecord,
                                       PasswordPolicyManager passwordPolicyManager,
                                       BasePasswordPolicyMapper basePasswordPolicyMapper,
                                       OauthTokenFeignClient oauthTokenFeignClient,
                                       UserPasswordValidator userPasswordValidator,
                                       SystemSettingService systemSettingService,
                                       SagaClient sagaClient,
                                       OrganizationAssertHelper organizationAssertHelper,
                                       OrganizationMapper organizationMapper,
                                       UserAssertHelper userAssertHelper,
                                       UserMapper userMapper,
                                       UserService userService) {
        this.passwordPolicyManager = passwordPolicyManager;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.sagaClient = sagaClient;
        this.userPasswordValidator = userPasswordValidator;
        this.passwordRecord = passwordRecord;
        this.systemSettingService = systemSettingService;
        this.oauthTokenFeignClient = oauthTokenFeignClient;
        this.organizationAssertHelper = organizationAssertHelper;
        this.organizationMapper = organizationMapper;
        this.userAssertHelper = userAssertHelper;
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_CREATE, description = "iam创建用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO create(UserDTO userDTO, boolean checkPassword) {
        String password =
                Optional.ofNullable(userDTO.getPassword())
                        .orElseThrow(() -> new CommonException("error.user.password.empty"));
        Long organizationId = userDTO.getOrganizationId();
        organizationAssertHelper.organizationNotExisted(organizationId);
        if (checkPassword) {
            validatePasswordPolicy(userDTO, password, organizationId);
            // 校验用户密码
            userPasswordValidator.validate(password, organizationId, true);
        }
        UserDTO user = createUser(userDTO);
        if (devopsMessage) {
            try {
                UserEventPayload userEventPayload = new UserEventPayload();
                userEventPayload.setEmail(user.getEmail());
                userEventPayload.setId(user.getId().toString());
                userEventPayload.setName(user.getRealName());
                userEventPayload.setUsername(user.getLoginName());
                userEventPayload.setFromUserId(DetailsHelper.getUserDetails().getUserId());
                userEventPayload.setOrganizationId(organizationId);
                //devop处理接受的是list
                List<UserEventPayload> payloads = new ArrayList<>();
                payloads.add(userEventPayload);
                String input = mapper.writeValueAsString(payloads);
                sagaClient.startSaga(USER_CREATE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.createUser.event", e);
            }
        }
        return user;
    }

    private UserDTO createUser(UserDTO userDTO) {
        userAssertHelper.loginNameExisted(userDTO.getLoginName());
        userDTO.setLocked(false);
        userDTO.setEnabled(true);
        userDTO.setPassword(ENCODER.encode(userDTO.getPassword()));
        if (userMapper.insertSelective(userDTO) != 1) {
            throw new InsertException("error.user.create");
        }
        passwordRecord.updatePassword(userDTO.getId(), userDTO.getPassword());
        return userMapper.selectByPrimaryKey(userDTO.getId());
    }

    private UserDTO insertSelective(UserDTO user) {
        if (userMapper.insertSelective(user) != 1) {
            throw new InsertException("error.user.create");
        }
        return userMapper.selectByPrimaryKey(user.getId());
    }


    @Override
    @Transactional(rollbackFor = CommonException.class)
    @Saga(code = USER_CREATE_BATCH, description = "iam批量创建用户", inputSchemaClass = List.class)
    public List<LdapErrorUserDTO> batchCreateUsers(List<UserDTO> insertUsers) {
        List<LdapErrorUserDTO> errorUsers = new ArrayList<>();
        List<UserEventPayload> payloads = new ArrayList<>();
        insertUsers.forEach(user -> {
            UserDTO userDTO = null;
            try {
                userDTO = insertSelective(user);
            } catch (Exception e) {
                LdapErrorUserDTO errorUser = new LdapErrorUserDTO();
                errorUser.setUuid(user.getUuid());
                errorUser.setLoginName(user.getLoginName());
                errorUser.setEmail(user.getEmail());
                errorUser.setRealName(user.getRealName());
                errorUser.setPhone(user.getPhone());
                errorUser.setCause(LdapErrorUserCause.USER_INSERT_ERROR.value());
                errorUsers.add(errorUser);
            }
            if (devopsMessage && userDTO != null && userDTO.getEnabled()) {
                UserEventPayload payload = new UserEventPayload();
                payload.setEmail(userDTO.getEmail());
                payload.setId(userDTO.getId().toString());
                payload.setName(userDTO.getRealName());
                payload.setUsername(userDTO.getLoginName());
                payload.setOrganizationId(userDTO.getOrganizationId());
                payloads.add(payload);
            }
        });

        if (!payloads.isEmpty()) {
            try {
                String input = mapper.writeValueAsString(payloads);
                String refIds = payloads.stream().map(UserEventPayload::getId).collect(Collectors.joining(","));
                sagaClient.startSaga(USER_CREATE_BATCH, new StartInstanceDTO(input, "users", refIds, ResourceLevel.ORGANIZATION.value(), insertUsers.get(0).getOrganizationId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.batchCreateUser.event", e);
            } finally {
                payloads.clear();
            }
        }
        return errorUsers;
    }

    private void validatePasswordPolicy(UserDTO userDTO, String password, Long organizationId) {
        BaseUserDTO baseUserDTO = new BaseUserDTO();
        BeanUtils.copyProperties(userDTO, baseUserDTO);
        BasePasswordPolicyDTO example = new BasePasswordPolicyDTO();
        example.setOrganizationId(organizationId);
        BasePasswordPolicyDTO basePasswordPolicyDTO = basePasswordPolicyMapper.selectOne(example);
        Optional.ofNullable(basePasswordPolicyDTO)
                .map(passwordPolicy -> {
                    if (!password.equals(passwordPolicy.getOriginalPassword())) {
                        passwordPolicyManager.passwordValidate(password, baseUserDTO, passwordPolicy);
                    }
                    return null;
                });
    }

    @Override
    public PageInfo<UserDTO> pagingQuery(PageRequest pageRequest, UserSearchDTO user) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> userMapper.fulltextSearch(user, ParamUtils.arrToStr(user.getParam())));
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_UPDATE, description = "iam更新用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO update(UserDTO userDTO) {
        organizationAssertHelper.organizationNotExisted(userDTO.getOrganizationId());
        UserDTO dto;
        if (devopsMessage) {
            UserEventPayload userEventPayload = new UserEventPayload();
            dto = updateUser(userDTO);
            userEventPayload.setEmail(dto.getEmail());
            userEventPayload.setId(dto.getId().toString());
            userEventPayload.setName(dto.getRealName());
            userEventPayload.setUsername(dto.getLoginName());
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_UPDATE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), userDTO.getOrganizationId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.updateUser.event", e);
            }
        } else {
            dto = updateUser(userDTO);
        }
        return dto;
    }

    private UserDTO updateUser(UserDTO userDTO) {
        if (userDTO.getPassword() != null) {
            userDTO.setPassword(ENCODER.encode(userDTO.getPassword()));
        }
        return updateSelective(userDTO);
    }

    private UserDTO updateSelective(UserDTO userDTO) {
        userAssertHelper.objectVersionNumberNotNull(userDTO.getObjectVersionNumber());
        if (userMapper.updateByPrimaryKeySelective(userDTO) != 1) {
            throw new UpdateExcetion("error.user.update");
        }
        return userMapper.selectByPrimaryKey(userDTO.getId());
    }

    @Transactional
    @Override
    public UserDTO resetUserPassword(Long organizationId, Long userId) {
        UserDTO user = userAssertHelper.userNotExisted(userId);
        if (user.getLdap()) {
            throw new CommonException("error.ldap.user.can.not.update.password");
        }

        String defaultPassword = getDefaultPassword(organizationId);
        user.setPassword(ENCODER.encode(defaultPassword));
        updateSelective(user);
        passwordRecord.updatePassword(user.getId(), user.getPassword());

        // delete access tokens, refresh tokens and sessions of the user after resetting his password
        oauthTokenFeignClient.deleteTokens(user.getLoginName());

        // send siteMsg
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("userName", user.getRealName());
        paramsMap.put("defaultPassword", defaultPassword);
        List<Long> userIds = Collections.singletonList(userId);
        userService.sendNotice(userId, userIds, "resetOrganizationUserPassword", paramsMap, organizationId);

        return user;
    }

    /**
     * get password to reset
     *
     * @param organizationId organization id
     * @return the password
     */
    private String getDefaultPassword(Long organizationId) {
        BasePasswordPolicyDTO basePasswordPolicyDTO = new BasePasswordPolicyDTO();
        basePasswordPolicyDTO.setOrganizationId(organizationId);
        basePasswordPolicyDTO = basePasswordPolicyMapper.selectOne(basePasswordPolicyDTO);
        if (basePasswordPolicyDTO != null && basePasswordPolicyDTO.getEnablePassword() && !StringUtils.isEmpty(basePasswordPolicyDTO.getOriginalPassword())) {
            return basePasswordPolicyDTO.getOriginalPassword();
        }

        SystemSettingDTO setting = systemSettingService.getSetting();
        if (setting != null && !StringUtils.isEmpty(setting.getDefaultPassword())) {
            return setting.getDefaultPassword();
        }

        return siteDefaultPassword;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_DELETE, description = "iam删除用户", inputSchemaClass = UserEventPayload.class)
    public void delete(Long organizationId, Long id) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        UserDTO user = userAssertHelper.userNotExisted(id);
        UserEventPayload userEventPayload = new UserEventPayload();
        userEventPayload.setUsername(user.getLoginName());
        userMapper.deleteByPrimaryKey(id);
        if (devopsMessage) {
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_DELETE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.deleteUser.event", e);
            }

        }
    }

    @Override
    public UserDTO query(Long organizationId, Long id) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        return userMapper.selectByPrimaryKey(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserDTO unlock(Long organizationId, Long userId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        return unlockUser(userId);
    }

    private UserDTO unlockUser(Long userId) {
        UserDTO userDTO = userAssertHelper.userNotExisted(userId);
        userDTO.setLocked(false);
        passwordRecord.unLockUser(userDTO.getId());
        return updateSelective(userDTO);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_ENABLE, description = "iam启用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO enableUser(Long organizationId, Long userId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        UserDTO user = updateStatus(userId, true);
        if (devopsMessage) {
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_ENABLE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.enableUser.event", e);
            }
        }
        return user;
    }

    private UserDTO updateStatus(Long userId, boolean enabled) {
        UserDTO dto = userAssertHelper.userNotExisted(userId);
        dto.setEnabled(enabled);
        if (userMapper.updateByPrimaryKeySelective(dto) != 1) {
            throw new UpdateExcetion("error.user.update");
        }
        return dto;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_DISABLE, description = "iam停用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO disableUser(Long organizationId, Long userId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        UserDTO user = updateStatus(userId, false);
        if (devopsMessage) {
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_DISABLE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.disableUser.event", e);
            }
        }
        return user;
    }

    @Override
    public List<Long> listUserIds(Long organizationId) {
        return organizationMapper.listMemberIds(organizationId, "organization");
    }
}
