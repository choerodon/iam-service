package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.app.service.OrganizationUserService;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDO;
import io.choerodon.oauth.core.password.domain.BaseUserDO;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.*;

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
    private IUserService iUserService;
    private SagaClient sagaClient;
    private final ObjectMapper mapper = new ObjectMapper();
    private PasswordPolicyManager passwordPolicyManager;
    private BasePasswordPolicyMapper basePasswordPolicyMapper;

    public OrganizationUserServiceImpl(OrganizationRepository organizationRepository,
                                       UserRepository userRepository,
                                       PasswordPolicyManager passwordPolicyManager,
                                       BasePasswordPolicyMapper basePasswordPolicyMapper,
                                       IUserService iUserService,
                                       SagaClient sagaClient) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.iUserService = iUserService;
        this.passwordPolicyManager = passwordPolicyManager;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.sagaClient = sagaClient;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_CREATE, description = "iam创建用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO create(UserDTO userDTO, boolean checkPassword) {
        String password =
                Optional.ofNullable(userDTO.getPassword())
                        .orElseThrow(() -> new CommonException("error.user.password.empty"));
        OrganizationDO organizationDO =
                Optional.ofNullable(organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId()))
                        .orElseThrow(() -> new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION));
        Long organizationId = organizationDO.getId();
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        if (checkPassword) {
            validatePasswordPolicy(userDTO, password, organizationId);
        }
        UserDTO dto = new UserDTO();
        UserE user = organizationE.addUser(ConvertHelper.convert(userDTO, UserE.class));
        BeanUtils.copyProperties(user, dto);
        if (devopsMessage) {
            try {
                UserEventPayload userEventPayload = new UserEventPayload();
                userEventPayload.setEmail(user.getEmail());
                userEventPayload.setId(user.getId().toString());
                userEventPayload.setName(user.getRealName());
                userEventPayload.setUsername(user.getLoginName());
                //devop处理接受的是list
                List<UserEventPayload> payloads = new ArrayList<>();
                payloads.add(userEventPayload);
                String input = mapper.writeValueAsString(payloads);
                sagaClient.startSaga(USER_CREATE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.createUser.event", e);
            }
        }
        return dto;
    }

    @Override
    @Transactional
    @Saga(code = USER_CREATE_BATCH, description = "iam批量创建用户", inputSchemaClass = List.class)
    public void batchCreateUsers(List<UserDO> insertUsers) {
        if (devopsMessage) {
            List<UserEventPayload> payloads = new ArrayList<>();
            List<UserDO> users = userRepository.insertList(insertUsers);
            users.forEach(user -> {
                UserEventPayload payload = new UserEventPayload();
                payload.setEmail(user.getEmail());
                payload.setId(user.getId().toString());
                payload.setName(user.getRealName());
                payload.setUsername(user.getLoginName());
                payloads.add(payload);
            });
            try {
                String input = mapper.writeValueAsString(payloads);
                String refIds = payloads.stream().map(UserEventPayload::getId).collect(Collectors.joining(","));
                sagaClient.startSaga(USER_CREATE_BATCH, new StartInstanceDTO(input, "users", refIds));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.batchCreateUser.event", e);
            }
        } else {
            userRepository.insertList(insertUsers);
        }
    }

    private void validatePasswordPolicy(UserDTO userDTO, String password, Long organizationId) {
        BaseUserDO baseUserDO = new BaseUserDO();
        BeanUtils.copyProperties(userDTO, baseUserDO);
        BasePasswordPolicyDO basePasswordPolicyDO = basePasswordPolicyMapper.findByOrgId(organizationId);
        Optional.ofNullable(basePasswordPolicyDO)
                .map(passwordPolicy -> {
                    if (!password.equals(passwordPolicy.getOriginalPassword())) {
                        passwordPolicyManager.passwordValidate(password, baseUserDO, passwordPolicy);
                    }
                    return null;
                });
    }

    @Override
    public Page<UserDTO> pagingQuery(PageRequest pageRequest, UserSearchDTO user) {
        Page<UserDO> userDOPage =
                userRepository.pagingQuery(pageRequest, ConvertHelper.convert(user, UserDO.class),
                        ParamUtils.arrToStr(user.getParam()));
        return ConvertPageHelper.convertPage(userDOPage, UserDTO.class);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_UPDATE, description = "iam更新用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO update(UserDTO userDTO) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId());
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        UserE userE = ConvertHelper.convert(userDTO, UserE.class);
        UserDTO dto;
        if (devopsMessage) {
            dto = new UserDTO();
            UserEventPayload userEventPayload = new UserEventPayload();
            UserE user = organizationE.updateUser(userE);
            userEventPayload.setEmail(user.getEmail());
            userEventPayload.setId(user.getId().toString());
            userEventPayload.setName(user.getRealName());
            userEventPayload.setUsername(user.getLoginName());
            BeanUtils.copyProperties(user, dto);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_UPDATE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.updateUser.event", e);
            }
        } else {
            dto = ConvertHelper.convert(organizationE.updateUser(userE), UserDTO.class);
        }
        return dto;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_DELETE, description = "iam删除用户", inputSchemaClass = UserEventPayload.class)
    public void delete(Long organizationId, Long id) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        UserE user = userRepository.selectByPrimaryKey(id);
        UserEventPayload userEventPayload = new UserEventPayload();
        userEventPayload.setUsername(user.getLoginName());
        organizationE.removeUserById(id);
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
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        return ConvertHelper.convert(organizationE.queryById(id), UserDTO.class);
    }

    @Override
    public UserDTO unlock(Long organizationId, Long userId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        return ConvertHelper.convert(organizationE.unlock(userId), UserDTO.class);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_ENABLE, description = "iam启用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO enableUser(Long organizationId, Long userId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        UserDTO userDTO;
        if (devopsMessage) {
            userDTO = new UserDTO();
            UserE user = userRepository.selectByPrimaryKey(userId);
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            UserDTO dto = ConvertHelper.convert(iUserService.updateUserEnabled(userId), UserDTO.class);
            BeanUtils.copyProperties(dto, userDTO);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_ENABLE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.enableUser.event", e);
            }
        } else {
            userDTO = ConvertHelper.convert(iUserService.updateUserEnabled(userId), UserDTO.class);
        }
        return userDTO;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = USER_DISABLE, description = "iam停用用户", inputSchemaClass = UserEventPayload.class)
    public UserDTO disableUser(Long organizationId, Long userId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        UserDTO userDTO;
        if (devopsMessage) {
            userDTO = new UserDTO();
            UserE user = userRepository.selectByPrimaryKey(userId);
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            userEventPayload.setId(userId.toString());
            UserDTO dto = ConvertHelper.convert(iUserService.updateUserDisabled(userId), UserDTO.class);
            BeanUtils.copyProperties(dto, userDTO);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_DISABLE, new StartInstanceDTO(input, "user", userEventPayload.getId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationUserService.disableUser.event", e);
            }
        } else {
            userDTO = ConvertHelper.convert(iUserService.updateUserDisabled(userId), UserDTO.class);
        }
        return userDTO;
    }
}
