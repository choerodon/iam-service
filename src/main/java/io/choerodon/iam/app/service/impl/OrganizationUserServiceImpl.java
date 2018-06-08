package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.event.producer.execute.EventProducerTemplate;
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

import static io.choerodon.iam.api.dto.payload.UserEventPayload.*;

/**
 * @author superlee
 * @date 2018/3/26
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
    private EventProducerTemplate eventProducerTemplate;
    private PasswordPolicyManager passwordPolicyManager;
    private BasePasswordPolicyMapper basePasswordPolicyMapper;

    public OrganizationUserServiceImpl(OrganizationRepository organizationRepository,
                                       UserRepository userRepository,
                                       PasswordPolicyManager passwordPolicyManager,
                                       BasePasswordPolicyMapper basePasswordPolicyMapper,
                                       IUserService iUserService,
                                       EventProducerTemplate eventProducerTemplate) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.iUserService = iUserService;
        this.passwordPolicyManager = passwordPolicyManager;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.eventProducerTemplate = eventProducerTemplate;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public UserDTO create(UserDTO userDTO, boolean checkPassword) {
        if (userDTO.getPassword() == null) {
            throw new CommonException("error.user.password.empty");
        }
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId());
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        UserDTO dto;
        //密码策略校验
        if (checkPassword) {
            UserE userE = ConvertHelper.convert(userDTO, UserE.class);
            BaseUserDO baseUserDO = new BaseUserDO();
            BeanUtils.copyProperties(userDTO, baseUserDO);
            BasePasswordPolicyDO basePasswordPolicyDO =
                    basePasswordPolicyMapper.selectByPrimaryKey(
                            basePasswordPolicyMapper.findByOrgId(organizationE.getId()));
            if (userE.getPassword() != null && !userE.getPassword().equals(basePasswordPolicyDO.getOriginalPassword())) {
                passwordPolicyManager.passwordValidate(userE.getPassword(), baseUserDO, basePasswordPolicyDO);
            }
        }
        if (devopsMessage) {
            dto = new UserDTO();
            UserEventPayload userEventPayload = new UserEventPayload();
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_CREATE_USER,
                    serviceName, userEventPayload, (String uuid) -> {
                        UserE user = organizationE.addUser(ConvertHelper.convert(userDTO, UserE.class));
                        userEventPayload.setEmail(user.getEmail());
                        userEventPayload.setId(user.getId().toString());
                        userEventPayload.setName(user.getRealName());
                        userEventPayload.setUsername(user.getLoginName());
                        BeanUtils.copyProperties(user, dto);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            UserE userE = organizationE.addUser(ConvertHelper.convert(userDTO, UserE.class));
            dto = ConvertHelper.convert(userE, UserDTO.class);
        }
        return dto;
    }

    @Override
    public Page<UserDTO> pagingQuery(PageRequest pageRequest, UserSearchDTO user) {
        Page<UserDO> userDOPage =
                userRepository.pagingQuery(pageRequest, ConvertHelper.convert(user, UserDO.class),
                        ParamUtils.arrToStr(user.getParams()));
        return ConvertPageHelper.convertPage(userDOPage, UserDTO.class);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
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
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_UPDATE_USER,
                    serviceName, userEventPayload, (String uuid) -> {
                        UserE user = organizationE.updateUser(userE);
                        userEventPayload.setEmail(user.getEmail());
                        userEventPayload.setId(user.getId().toString());
                        userEventPayload.setName(user.getRealName());
                        userEventPayload.setUsername(user.getLoginName());
                        BeanUtils.copyProperties(user, dto);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            dto = ConvertHelper.convert(organizationE.updateUser(userE), UserDTO.class);
        }
        return dto;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public void delete(Long organizationId, Long id) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        OrganizationE organizationE = ConvertHelper.convert(organizationDO, OrganizationE.class);
        if (devopsMessage) {
            UserE user = userRepository.selectByPrimaryKey(id);
            UserEventPayload userEventPayload = new UserEventPayload();
            userEventPayload.setUsername(user.getLoginName());
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_DELETE_USER,
                    serviceName, userEventPayload,
                    (String uuid) -> organizationE.removeUserById(id));
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            organizationE.removeUserById(id);
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
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_ENABLE_USER,
                    serviceName, userEventPayload,
                    (String uuid) -> {
                        UserDTO dto = ConvertHelper.convert(iUserService.updateUserEnabled(userId), UserDTO.class);
                        BeanUtils.copyProperties(dto, userDTO);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            userDTO = ConvertHelper.convert(iUserService.updateUserEnabled(userId), UserDTO.class);
        }
        return userDTO;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
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
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_DISABLE_USER,
                    serviceName, userEventPayload,
                    (String uuid) -> {
                        UserDTO dto = ConvertHelper.convert(iUserService.updateUserDisabled(userId), UserDTO.class);
                        BeanUtils.copyProperties(dto, userDTO);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
        } else {
            userDTO = ConvertHelper.convert(iUserService.updateUserDisabled(userId), UserDTO.class);
        }
        return userDTO;
    }
}
