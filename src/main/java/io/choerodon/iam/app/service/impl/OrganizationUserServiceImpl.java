package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.*;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageInfo;
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
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.SystemSettingDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.enums.LdapErrorUserCause;
import io.choerodon.iam.infra.feign.OauthTokenFeignClient;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDTO;
import io.choerodon.oauth.core.password.domain.BaseUserDTO;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import io.choerodon.oauth.core.password.record.PasswordRecord;

/**
 * @author superlee
 */
@Component
@RefreshScope
public class OrganizationUserServiceImpl implements OrganizationUserService {
    private static final String ORGANIZATION_NOT_EXIST_EXCEPTION = "error.organization.not.exist";
    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;
    @Value("${spring.application.name:default}")
    private String serviceName;
    private OrganizationRepository organizationRepository;
    private UserRepository userRepository;
    private PasswordRecord passwordRecord;
    private IUserService iUserService;
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

    public OrganizationUserServiceImpl(OrganizationRepository organizationRepository,
                                       UserRepository userRepository,
                                       PasswordRecord passwordRecord,
                                       PasswordPolicyManager passwordPolicyManager,
                                       BasePasswordPolicyMapper basePasswordPolicyMapper,
                                       OauthTokenFeignClient oauthTokenFeignClient,
                                       UserPasswordValidator userPasswordValidator,
                                       IUserService iUserService,
                                       SystemSettingService systemSettingService,
                                       SagaClient sagaClient) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.iUserService = iUserService;
        this.passwordPolicyManager = passwordPolicyManager;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.sagaClient = sagaClient;
        this.userPasswordValidator = userPasswordValidator;
        this.passwordRecord = passwordRecord;
        this.systemSettingService = systemSettingService;
        this.oauthTokenFeignClient = oauthTokenFeignClient;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_CREATE, description = "iam创建用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO create(UserDTO userDTO, boolean checkPassword, boolean defaultEnabled) {
        String password =
                Optional.ofNullable(userDTO.getPassword())
                        .orElseThrow(() -> new CommonException("error.user.password.empty"));
        OrganizationDTO organizationDTO =
                Optional.ofNullable(organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId()))
                        .orElseThrow(() -> new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION));
        Long organizationId = organizationDTO.getId();
        if (checkPassword) {
            validatePasswordPolicy(userDTO, password, organizationId);
            // 校验用户密码
            userPasswordValidator.validate(password, organizationId, true);
        }
        UserDTO user = createUser(userDTO, defaultEnabled);
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

    private UserDTO createUser(UserDTO userDTO, boolean defaultEnabled) {
        if (userRepository.selectByLoginName(userDTO.getLoginName()) != null) {
            throw new CommonException("error.user.loginName.exist");
        }
        userDTO.setLocked(false);
        userDTO.setEnabled(defaultEnabled);
        userDTO.setPassword(ENCODER.encode(userDTO.getPassword()));
        userRepository.insertSelective(userDTO);
        passwordRecord.updatePassword(userDTO.getId(), userDTO.getPassword());
        return userRepository.selectByPrimaryKey(userDTO.getId());
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
                userDTO = userRepository.insertSelective(user);
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
    public PageInfo<UserDTO> pagingQuery(int page, int size, UserSearchDTO user) {
        return userRepository.pagingQuery(page, size, user, ParamUtils.arrToStr(user.getParam()));
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_UPDATE, description = "iam更新用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO update(UserDTO userDTO) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId());
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
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
        return userRepository.updateSelective(userDTO);
    }

    @Transactional
    @Override
    public UserDTO resetUserPassword(Long organizationId, Long userId) {
        UserDTO user = userRepository.selectByPrimaryKey(userId);
        if (user == null) {
            throw new CommonException("error.user.not.exist", userId);
        }

        if (user.getLdap()) {
            throw new CommonException("error.ldap.user.can.not.update.password");
        }

        String defaultPassword = getDefaultPassword(organizationId);
        user.setPassword(ENCODER.encode(defaultPassword));
        userRepository.updateSelective(user);
        passwordRecord.updatePassword(user.getId(), user.getPassword());

        // delete access tokens, refresh tokens and sessions of the user after resetting his password
        oauthTokenFeignClient.deleteTokens(user.getLoginName());

        // send siteMsg
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("userName", user.getRealName());
        paramsMap.put("defaultPassword", defaultPassword);
        List<Long> userIds = Collections.singletonList(userId);
        iUserService.sendNotice(userId, userIds, "resetOrganizationUserPassword", paramsMap, organizationId);

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
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        UserDTO user = userRepository.selectByPrimaryKey(id);
        UserEventPayload userEventPayload = new UserEventPayload();
        userEventPayload.setUsername(user.getLoginName());
        userRepository.deleteById(id);
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
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        return userRepository.selectByPrimaryKey(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserDTO unlock(Long organizationId, Long userId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        return unlockUser(userId);
    }

    private UserDTO unlockUser(Long userId) {
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        if (userDTO == null) {
            throw new CommonException("error.user.not.exist");
        }
        userDTO.setLocked(false);
        passwordRecord.unLockUser(userDTO.getId());
        return userRepository.updateSelective(userDTO);
//        return userDTO;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_ENABLE, description = "iam启用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO enableUser(Long organizationId, Long userId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        UserDTO userDTO;
        if (devopsMessage) {
            userDTO = new UserDTO();
            UserDTO user = userRepository.selectByPrimaryKey(userId);
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            UserDTO dto = iUserService.updateUserEnabled(userId);
            BeanUtils.copyProperties(dto, userDTO);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_ENABLE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.enableUser.event", e);
            }
        } else {
            userDTO = iUserService.updateUserEnabled(userId);
        }
        return userDTO;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_DISABLE, description = "iam停用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO disableUser(Long organizationId, Long userId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        UserDTO userDTO;
        if (devopsMessage) {
            userDTO = new UserDTO();
            UserDTO user = userRepository.selectByPrimaryKey(userId);
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            UserDTO dto = iUserService.updateUserDisabled(userId);
            BeanUtils.copyProperties(dto, userDTO);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_DISABLE, new StartInstanceDTO(input, "user", userEventPayload.getId(), ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.disableUser.event", e);
            }
        } else {
            userDTO = iUserService.updateUserDisabled(userId);
        }
        return userDTO;
    }

    @Override
    public List<Long> listUserIds(Long organizationId) {
        return organizationRepository.listMemberIds(organizationId);
    }
}
