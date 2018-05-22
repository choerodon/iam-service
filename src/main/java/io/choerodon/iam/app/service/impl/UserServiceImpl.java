package io.choerodon.iam.app.service.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import io.choerodon.event.producer.execute.EventProducerTemplate;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.*;
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

import static io.choerodon.iam.api.dto.payload.UserEventPayload.EVENT_TYPE_UPDATE_USER;

/**
 * @author superlee
 */
@Component
@RefreshScope
public class UserServiceImpl implements UserService {

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

    private static final String USER_NOT_LOGIN_EXCEPTION = "error.user.not.login";
    private static final String USER_ID_NOT_EQUAL_EXCEPTION = "error.user.id.not.equals";

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
        return getOwnedOrganizations(userId, includedDisabled);
    }

    @Override
    public List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled) {
        checkLoginUser(id);
        ProjectDO project = new ProjectDO();
        if (!includedDisabled) {
            project.setEnabled(true);
        }
        return ConvertHelper
                .convertList(projectRepository
                        .selectProjectsFromMemberRoleByOptions(id, project), ProjectDTO.class);
    }

    @Override
    public List<ProjectDTO> queryProjectsByOrganizationId(Long userId, Long organizationId) {
        checkLoginUser(userId);
        ProjectDO projectDO = new ProjectDO();
        projectDO.setOrganizationId(organizationId);
        return null;
    }

    private void checkLoginUser(Long id) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        if (!id.equals(customUserDetails.getUserId())) {
            throw new CommonException(USER_ID_NOT_EQUAL_EXCEPTION);
        }
    }

    @Override
    public Page<UserDTO> pagingQueryUsersWithSiteLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithSiteLevelRoles(
                        pageRequest, roleAssignmentSearchDTO), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithOrganizationLevelRoles(
                        pageRequest, roleAssignmentSearchDTO, sourceId), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithProjectLevelRoles(
                        pageRequest, roleAssignmentSearchDTO, sourceId), UserDTO.class);
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
        return fileFeignClient.uploadFile(organizationId, bakcetName, file.getOriginalFilename(), file).getBody();
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
    public UserInfoDTO queryInfo(Long userId) {
        checkLoginUser(userId);
        UserE user = userRepository.selectByPrimaryKey(userId);
        return ConvertHelper.convert(user, UserInfoDTO.class);
    }

    @Override
    public UserInfoDTO updateInfo(UserInfoDTO userInfo) {
        checkLoginUser(userInfo.getId());
        UserE userE = ConvertHelper.convert(userInfo, UserE.class);
        UserInfoDTO dto ;
        if (devopsMessage) {
            dto = new UserInfoDTO();
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
            dto = ConvertHelper.convert(iUserService.updateUserInfo(userE), UserInfoDTO.class);
        }
        return dto;
    }

    @Override
    public void check(UserDTO user) {
        //传入id则为更新重名校验，不传id为新建重名校验
        Boolean createCheck = StringUtils.isEmpty(user.getId());
        Boolean checkLoginName = !StringUtils.isEmpty(user.getLoginName());
        Boolean checkEmail = !StringUtils.isEmpty(user.getEmail());
        if (!checkEmail && !checkLoginName) {
            throw new CommonException("error.user.validation.fields.empty");
        }
        UserDO userDO = ConvertHelper.convert(user, UserDO.class);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDO) != null;
            if (existed && checkLoginName) {
                throw new CommonException("error.user.loginName.exist");
            }
            if (existed && checkEmail) {
                throw new CommonException("error.user.email.exist");
            }
        } else {
            Long id = userDO.getId();
            userDO.setId(null);
            UserDO userDO1 = userRepository.selectOne(userDO);
            Boolean existed = userDO1 != null && !id.equals(userDO1.getId());
            if (existed && checkEmail) {
                throw new CommonException("error.user.email.exist");
            }
        }
    }

    @Override
    public UserInfoDTO queryByLoginName(String loginName) {
        return ConvertHelper.convert(userRepository.selectByLoginName(loginName), UserInfoDTO.class);
    }

    @Override
    public UserDTO lockUser(Long userId, Integer lockExpireTime) {
        UserE userE = userRepository.selectByPrimaryKey(userId);
        userE.locked();
        userE.lockUtilAt(new Date(System.currentTimeMillis() + lockExpireTime * 1000));
        userE = userRepository.updateSelective(userE);
        return ConvertHelper.convert(userE, UserDTO.class);
    }
}