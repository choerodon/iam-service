package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.event.producer.execute.EventProducerTemplate;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDO;
import io.choerodon.oauth.core.password.domain.BaseUserDO;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import io.choerodon.oauth.core.password.record.PasswordRecord;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static io.choerodon.iam.api.dto.payload.UserEventPayload.EVENT_TYPE_UPDATE_USER;

/**
 * @author superlee
 */
@Component
@RefreshScope
public class UserServiceImpl implements UserService {

    private static final String USER_NOT_LOGIN_EXCEPTION = "error.user.not.login";
    private static final String USER_ID_NOT_EQUAL_EXCEPTION = "error.user.id.not.equals";
    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;
    @Value("${spring.application.name:default}")
    private String serviceName;
    private UserRepository userRepository;
    private IUserService iUserService;
    private OrganizationRepository organizationRepository;
    private ProjectRepository projectRepository;
    private PasswordRecord passwordRecord;
    private FileFeignClient fileFeignClient;
    private BasePasswordPolicyMapper basePasswordPolicyMapper;
    private PasswordPolicyManager passwordPolicyManager;
    private EventProducerTemplate eventProducerTemplate;

    public UserServiceImpl(UserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           ProjectRepository projectRepository,
                           IUserService iUserService,
                           PasswordRecord passwordRecord,
                           FileFeignClient fileFeignClient,
                           EventProducerTemplate eventProducerTemplate,
                           BasePasswordPolicyMapper basePasswordPolicyMapper,
                           PasswordPolicyManager passwordPolicyManager) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.iUserService = iUserService;
        this.passwordRecord = passwordRecord;
        this.fileFeignClient = fileFeignClient;
        this.eventProducerTemplate = eventProducerTemplate;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.passwordPolicyManager = passwordPolicyManager;
    }

    @Override
    public UserDTO querySelf() {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        Long userId = customUserDetails.getUserId();
        return ConvertHelper.convert(userRepository.selectByPrimaryKey(userId), UserDTO.class);
    }

    @Override
    public List<OrganizationDTO> queryOrganizations(Long userId, Boolean includedDisabled) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        if (!userId.equals(customUserDetails.getUserId())) {
            throw new CommonException(USER_ID_NOT_EQUAL_EXCEPTION);
        }
        boolean isAdmin = customUserDetails.getAdmin() == null ? false : customUserDetails.getAdmin();
        //superAdmin例外处理
        if (isAdmin) {
            return ConvertHelper.convertList(organizationRepository.selectAll(), OrganizationDTO.class);
        } else {
            return getOwnedOrganizations(userId, includedDisabled);
        }

    }

    @Override
    public List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled) {
        CustomUserDetails customUserDetails = checkLoginUser(id);
        boolean isAdmin = customUserDetails.getAdmin() == null ? false : customUserDetails.getAdmin();
        //superAdmin例外处理
        if (isAdmin) {
            return ConvertHelper.convertList(projectRepository.selectAll(), ProjectDTO.class);
        } else {
            ProjectDO project = new ProjectDO();
            if (!includedDisabled) {
                project.setEnabled(true);
            }
            return ConvertHelper
                    .convertList(projectRepository
                            .selectProjectsFromMemberRoleByOptions(id, project), ProjectDTO.class);
        }
    }

    @Override
    public List<ProjectDTO> queryProjectsByOrganizationId(Long userId, Long organizationId) {
        checkLoginUser(userId);
        ProjectDO projectDO = new ProjectDO();
        projectDO.setOrganizationId(organizationId);
        return null;
    }

    private CustomUserDetails checkLoginUser(Long id) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        if (!id.equals(customUserDetails.getUserId())) {
            throw new CommonException(USER_ID_NOT_EQUAL_EXCEPTION);
        }
        return customUserDetails;
    }

    @Override
    public Page<UserWithRoleDTO> pagingQueryUsersWithSiteLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithSiteLevelRoles(
                        pageRequest, roleAssignmentSearchDTO), UserWithRoleDTO.class);
    }

    @Override
    public Page<UserWithRoleDTO> pagingQueryUsersWithOrganizationLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithOrganizationLevelRoles(
                        pageRequest, roleAssignmentSearchDTO, sourceId), UserWithRoleDTO.class);
    }

    @Override
    public Page<UserWithRoleDTO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithProjectLevelRoles(
                        pageRequest, roleAssignmentSearchDTO, sourceId), UserWithRoleDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdOnSiteLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdOnOrganizationLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId, sourceId), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdOnProjectLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId, sourceId), UserDTO.class);
    }

    @Override
    public String uploadPhoto(Long id, MultipartFile file) {
        checkLoginUser(id);
        Long organizationId = DetailsHelper.getUserDetails().getOrganizationId();
        String bakcetName = "iam-service";
        FileDTO fileDTO = fileFeignClient.upload(bakcetName, file.getOriginalFilename(), file).getBody();
        return bakcetName + fileDTO.getFileName();
    }

    @Override
    public List<OrganizationDTO> queryOrganizationWithProjects() {
        return null;
    }


    private List<OrganizationDTO> getOwnedOrganizations(Long userId, Boolean includedDisabled) {
        List<OrganizationDTO> resultOrganizations =
                ConvertHelper.convertList(
                        organizationRepository.selectFromMemberRoleByMemberId(userId, includedDisabled), OrganizationDTO.class);
        List<OrganizationDTO> notIntoOrganizations = ConvertHelper.convertList(
                organizationRepository.selectOrgByUserAndPros(userId, includedDisabled), OrganizationDTO.class);
        List<Long> resultIds = resultOrganizations.stream().map(OrganizationDTO::getId).collect(Collectors.toList());
        List<Long> notIntoIds = notIntoOrganizations.stream().map(OrganizationDTO::getId).collect(Collectors.toList());
        //差集
        notIntoIds.removeAll(resultIds);
        notIntoOrganizations = notIntoOrganizations.stream().filter(o -> notIntoIds.contains(o.getId())).collect(Collectors.toList());
        notIntoOrganizations.forEach(i -> i.setInto(false));
        resultOrganizations.addAll(notIntoOrganizations);
        return resultOrganizations;
    }

    @Override
    public void selfUpdatePassword(Long userId, UserPasswordDTO userPasswordDTO, Boolean checkPassword) {
        checkLoginUser(userId);
        UserE user = userRepository.selectByPrimaryKey(userId);
        if (user.getLdap()) {
            throw new CommonException("error.ldap.user.can.not.update.password");
        }
        if (!user.comparePassword(userPasswordDTO.getOriginalPassword())) {
            throw new CommonException("error.password.originalPassword");
        }
        //密码策略
        if (checkPassword && user != null) {
            BaseUserDO baseUserDO = new BaseUserDO();
            BeanUtils.copyProperties(user, baseUserDO);
            OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(user.getOrganizationId());
            if (organizationDO != null) {
                BasePasswordPolicyDO basePasswordPolicyDO =
                        basePasswordPolicyMapper.selectByPrimaryKey(
                                basePasswordPolicyMapper.findByOrgId(organizationDO.getId()));
                if (userPasswordDTO.getPassword() != null && !userPasswordDTO.getPassword().equals(basePasswordPolicyDO.getOriginalPassword())) {
                    passwordPolicyManager.passwordValidate(userPasswordDTO.getPassword(), baseUserDO, basePasswordPolicyDO);
                }
            }
        }
        user.resetPassword(userPasswordDTO.getPassword());
        userRepository.updateSelective(user);
        passwordRecord.updatePassword(user.getId(), user.getPassword());
    }

    @Override
    public UserDTO queryInfo(Long userId) {
        checkLoginUser(userId);
        UserE user = userRepository.selectByPrimaryKey(userId);
        return ConvertHelper.convert(user, UserDTO.class);
    }

    @Override
    public UserDTO updateInfo(UserDTO userDTO) {
        checkLoginUser(userDTO.getId());
        UserE userE = ConvertHelper.convert(userDTO, UserE.class);
        UserDTO dto;
        if (devopsMessage) {
            dto = new UserDTO();
            UserEventPayload userEventPayload = new UserEventPayload();
            Exception exception = eventProducerTemplate.execute("user", EVENT_TYPE_UPDATE_USER,
                    serviceName, userEventPayload, (String uuid) -> {
                        UserE user = iUserService.updateUserInfo(userE);
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
            dto = ConvertHelper.convert(iUserService.updateUserInfo(userE), UserDTO.class);
        }
        return dto;
    }

    @Override
    public void check(UserDTO user) {
        Boolean checkLoginName = !StringUtils.isEmpty(user.getLoginName());
        Boolean checkEmail = !StringUtils.isEmpty(user.getEmail());
        if (!checkEmail && !checkLoginName) {
            throw new CommonException("error.user.validation.fields.empty");
        }
        if (checkLoginName) {
            checkLoginName(user);
        }
        if (checkEmail) {
            checkEmail(user);
        }
    }

    private void checkEmail(UserDTO user) {
        Boolean createCheck = StringUtils.isEmpty(user.getId());
        String email = user.getEmail();
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDO) != null;
            if (existed) {
                throw new CommonException("error.user.email.exist");
            }
        } else {
            Long id = user.getId();
            UserDO userDO1 = userRepository.selectOne(userDO);
            Boolean existed = userDO1 != null && !id.equals(userDO1.getId());
            if (existed) {
                throw new CommonException("error.user.email.exist");
            }
        }
    }

    private void checkLoginName(UserDTO user) {
        Boolean createCheck = StringUtils.isEmpty(user.getId());
        String loginName = user.getLoginName();
        UserDO userDO = new UserDO();
        userDO.setLoginName(loginName);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDO) != null;
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }
        } else {
            Long id = user.getId();
            UserDO userDO1 = userRepository.selectOne(userDO);
            Boolean existed = userDO1 != null && !id.equals(userDO1.getId());
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }

        }
    }

    @Override
    public UserDTO queryByLoginName(String loginName) {
        return ConvertHelper.convert(userRepository.selectByLoginName(loginName), UserDTO.class);
    }

    @Override
    public UserDTO lockUser(Long userId, Integer lockExpireTime) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        userE.locked();
        userE.lockUtilAt(new Date(System.currentTimeMillis() + lockExpireTime * 1000));
        userE = userRepository.updateSelective(userE);
        return ConvertHelper.convert(userE, UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest, UserDO userDO, String params) {
        return ConvertPageHelper.convertPage(userRepository
                .pagingQueryAdminUsers(pageRequest, userDO, params), UserDTO.class);
    }

    @Override
    @Transactional
    public void addAdminUsers(long[] ids) {
        for (long id : ids) {
            UserE userE = userRepository.selectByPrimaryKey(id);
            if (userE != null && !userE.getAdmin()) {
                userE.becomeAdminUser();
                userRepository.updateSelective(userE);
            }
        }
    }

    @Override
    public void deleteAdminUser(long id) {
        UserE userE = userRepository.selectByPrimaryKey(id);
        if (userE == null) {
            throw new CommonException("error.user.not.exist");
        }
        UserDO userDO = new UserDO();
        userDO.setAdmin(true);
        if (userRepository.selectCount(userDO) > 1) {
            if (userE.getAdmin()) {
                userE.becomeNotAdminUser();
                userRepository.updateSelective(userE);
            }
        } else {
            throw new CommonException("error.user.admin.size");
        }
    }

    @Override
    public List<UserDTO> listUsersByIds(Long[] ids) {
        if (ids.length == 0) {
            return new ArrayList<>();
        } else {
            return ConvertHelper.convertList(userRepository.listUsersByIds(ids), UserDTO.class);
        }
    }

}