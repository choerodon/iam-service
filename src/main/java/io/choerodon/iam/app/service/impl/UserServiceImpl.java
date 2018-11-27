package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.USER_UPDATE;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.iam.api.validator.UserPasswordValidator;
import io.choerodon.iam.infra.common.utils.ImageUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.dataobject.*;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDO;
import io.choerodon.oauth.core.password.domain.BaseUserDO;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import io.choerodon.oauth.core.password.record.PasswordRecord;

/**
 * @author superlee
 */
@Component
@RefreshScope
public class UserServiceImpl implements UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

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
    private UserPasswordValidator userPasswordValidator;
    private RoleRepository roleRepository;
    private SagaClient sagaClient;
    private MemberRoleMapper memberRoleMapper;
    private final ObjectMapper mapper = new ObjectMapper();

    public UserServiceImpl(UserRepository userRepository,
                           OrganizationRepository organizationRepository,
                           ProjectRepository projectRepository,
                           IUserService iUserService,
                           PasswordRecord passwordRecord,
                           FileFeignClient fileFeignClient,
                           SagaClient sagaClient,
                           BasePasswordPolicyMapper basePasswordPolicyMapper,
                           UserPasswordValidator userPasswordValidator,
                           PasswordPolicyManager passwordPolicyManager,
                           RoleRepository roleRepository,
                           MemberRoleMapper memberRoleMapper) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.projectRepository = projectRepository;
        this.iUserService = iUserService;
        this.passwordRecord = passwordRecord;
        this.fileFeignClient = fileFeignClient;
        this.sagaClient = sagaClient;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.passwordPolicyManager = passwordPolicyManager;
        this.userPasswordValidator = userPasswordValidator;
        this.roleRepository = roleRepository;
        this.memberRoleMapper = memberRoleMapper;
    }

    @Override
    public UserDTO querySelf() {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        Long userId = customUserDetails.getUserId();
        UserDTO userDTO = ConvertHelper.convert(userRepository.selectByPrimaryKey(userId), UserDTO.class);
        if (userDTO != null && userDTO.getOrganizationId() != null) {
            OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId());
            userDTO.setOrganizationName(organizationDO.getName());
        }
        return userDTO;
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
        return new ArrayList<>();
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
    public Page<UserWithRoleDTO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersWithProjectLevelRoles(
                        pageRequest, roleAssignmentSearchDTO, sourceId, doPage), UserWithRoleDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdAndLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId, 0L, ResourceLevel.SITE.value(), doPage), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdAndLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.ORGANIZATION.value(), doPage), UserDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByRoleIdAndLevel(
                        pageRequest, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.PROJECT.value(), doPage), UserDTO.class);
    }

    @Override
    public String uploadPhoto(Long id, MultipartFile file) {
        checkLoginUser(id);
        return fileFeignClient.uploadFile("iam-service", file.getOriginalFilename(), file).getBody();
    }


    @Override
    public String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height) {
        checkLoginUser(id);
        try {
            file = ImageUtils.cutImage(file, rotate, axisX, axisY, width, height);
            String photoUrl = fileFeignClient.uploadFile("iam-service", file.getOriginalFilename(), file).getBody();
            userRepository.updatePhoto(id, photoUrl);
            return photoUrl;
        } catch (Exception e) {
            LOGGER.warn("error happened when save photo {}", e.getMessage());
            throw new CommonException("error.user.photo.save");
        }
    }

    @Override
    public List<OrganizationDTO> queryOrganizationWithProjects() {
        return new ArrayList<>(0);
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
        if (checkPassword) {
            BaseUserDO baseUserDO = new BaseUserDO();
            BeanUtils.copyProperties(user, baseUserDO);
            OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(user.getOrganizationId());
            if (organizationDO != null) {
                BasePasswordPolicyDO example = new BasePasswordPolicyDO();
                example.setOrganizationId(organizationDO.getId());
                BasePasswordPolicyDO basePasswordPolicyDO = basePasswordPolicyMapper.selectOne(example);
                if (userPasswordDTO.getPassword() != null) {
                    passwordPolicyManager.passwordValidate(userPasswordDTO.getPassword(), baseUserDO, basePasswordPolicyDO);
                }
                // 校验用户密码
                userPasswordValidator.validate(userPasswordDTO.getPassword(), organizationDO.getId(), true);
            }
        }
        user.resetPassword(userPasswordDTO.getPassword());
        userRepository.updateSelective(user);
        passwordRecord.updatePassword(user.getId(), user.getPassword());

        // send siteMsg
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("userName", user.getRealName());
        List<Long> userIds = new ArrayList<>();
        userIds.add(user.getId());
        iUserService.sendNotice(user.getId(), userIds, "modifyPassword", paramsMap, 0L);
    }

    @Override
    public UserDTO queryInfo(Long userId) {
        checkLoginUser(userId);
        UserE user = userRepository.selectByPrimaryKey(userId);
        return ConvertHelper.convert(user, UserDTO.class);
    }

    @Override
    @Transactional
    public UserDTO updateInfo(UserDTO userDTO) {
        checkLoginUser(userDTO.getId());
        UserE userE = ConvertHelper.convert(userDTO, UserE.class);
        UserDTO dto;
        if (devopsMessage) {
            dto = new UserDTO();
            UserEventPayload userEventPayload = new UserEventPayload();
            UserE user = iUserService.updateUserInfo(userE);
            userEventPayload.setEmail(user.getEmail());
            userEventPayload.setId(user.getId().toString());
            userEventPayload.setName(user.getRealName());
            userEventPayload.setUsername(user.getLoginName());
            BeanUtils.copyProperties(user, dto);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_UPDATE, new StartInstanceDTO(input, "user", "" + user.getId()));
            } catch (Exception e) {
                throw new CommonException("error.UserService.updateInfo.event", e);
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
        if (!Pattern.matches(UserDTO.LOGIN_NAME_REG, loginName)) {
            throw new CommonException("error.user.loginName.regex");
        }
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

    @Override
    public List<UserDTO> listUsersByEmails(String[] emails) {
        if (emails.length == 0) {
            return new ArrayList<>();
        } else {
            return ConvertHelper.convertList(userRepository.listUsersByEmails(emails), UserDTO.class);
        }
    }

    @Override
    public Page<OrganizationWithRoleDTO> pagingQueryOrganizationsWithRoles(PageRequest pageRequest, Long id, String params) {
        return ConvertPageHelper.convertPage(organizationRepository.pagingQueryOrganizationAndRoleById(
                pageRequest, id, params), OrganizationWithRoleDTO.class);
    }

    @Override
    public Page<ProjectWithRoleDTO> pagingQueryProjectAndRolesById(PageRequest pageRequest, Long id, String params) {
        return ConvertPageHelper.convertPage(projectRepository.pagingQueryProjectAndRolesById(
                pageRequest, id, params), ProjectWithRoleDTO.class);
    }

    @Override
    @Transactional
    public UserDTO createUserAndAssignRoles(final CreateUserWithRolesDTO userWithRoles) {
        List<RoleDO> roles = validateRoles(userWithRoles);
        UserDO user = validateUser(userWithRoles);
        UserE userE = userRepository.insertSelective(ConvertHelper.convert(user, UserE.class));
        Long userId = userE.getId();
        roles.forEach(r -> {
            MemberRoleDO memberRole = new MemberRoleDO();
            memberRole.setMemberId(userId);
            memberRole.setMemberType(userWithRoles.getMemberType());
            memberRole.setRoleId(r.getId());
            memberRole.setSourceId(userWithRoles.getSourceId());
            memberRole.setSourceType(userWithRoles.getSourceType());
            if (memberRoleMapper.selectOne(memberRole) == null
                    && memberRoleMapper.insertSelective(memberRole) != 1) {
                throw new CommonException("error.memberRole.insert");
            }
        });
        return ConvertHelper.convert(userE, UserDTO.class);
    }

    @Override
    public Page<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                                    PageRequest pageRequest, String params) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        Page<ProjectDO> projectDOPage =
                projectRepository.pagingQueryByUserId(customUserDetails.getUserId(), ConvertHelper.convert(
                        projectDTO, ProjectDO.class), pageRequest, params);
        return ConvertPageHelper.convertPage(projectDOPage, ProjectDTO.class);
    }

    @Override
    public Page<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                              PageRequest pageRequest, String params) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        Page<OrganizationDO> organizationDOPage = organizationRepository.pagingQueryByUserId(customUserDetails.getUserId(), ConvertHelper.convert(organizationDTO, OrganizationDO.class), pageRequest, params);
        return ConvertPageHelper.convertPage(organizationDOPage, OrganizationDTO.class);
    }

    @Override
    public Long[] listUserIds() {
        return userRepository.listUserIds();
    }

    private UserDO validateUser(CreateUserWithRolesDTO userWithRoles) {
        UserDO user = userWithRoles.getUser();
        String loginName = user.getLoginName();
        String email = user.getEmail();
        if (StringUtils.isEmpty(loginName)) {
            throw new CommonException("error.user.loginName.empty");
        }
        if (StringUtils.isEmpty(email)) {
            throw new CommonException("error.user.email.empty");
        }
        if (userRepository.selectByLoginName(loginName) != null) {
            throw new CommonException("error.user.loginName.existed");
        }
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        if (userRepository.selectOne(userDO) != null) {
            throw new CommonException("error.user.email.existed");
        }
        validatePassword(user);
        user.setPassword(ENCODER.encode(user.getPassword()));
        user.setEnabled(true);
        user.setLdap(false);
        if (user.getLanguage() == null) {
            user.setLanguage("zh_CN");
        }
        if (user.getTimeZone() == null) {
            user.setTimeZone("CTT");
        }
        user.setLastPasswordUpdatedAt(new Date(System.currentTimeMillis()));
        user.setLocked(false);
        user.setAdmin(false);
        return user;
    }

    private void validatePassword(UserDO user) {
        String password = user.getPassword();
        if (StringUtils.isEmpty(password)) {
            throw new CommonException("error.user.password.empty");
        }
        Long organizationId = user.getOrganizationId();
        BaseUserDO userDO = new BaseUserDO();
        BeanUtils.copyProperties(user, userDO);
        BasePasswordPolicyDO example = new BasePasswordPolicyDO();
        example.setOrganizationId(organizationId);
        Optional.ofNullable(basePasswordPolicyMapper.selectOne(example))
                .ifPresent(passwordPolicy -> {
                    if (!password.equals(passwordPolicy.getOriginalPassword())) {
                        passwordPolicyManager.passwordValidate(password, userDO, passwordPolicy);
                    }
                });
    }

    private List<RoleDO> validateRoles(CreateUserWithRolesDTO userWithRoles) {
        UserDO user = userWithRoles.getUser();
        if (user == null) {
            throw new CommonException("error.user.null");
        }
        Long sourceId = userWithRoles.getSourceId();
        String sourceType = userWithRoles.getSourceType();
        validateSourceType(user, sourceId, sourceType);
        if (userWithRoles.getMemberType() == null) {
            userWithRoles.setMemberType("user");
        }
        Set<String> roleCodes = userWithRoles.getRoleCode();
        List<RoleDO> roles = new ArrayList<>();
        if (roleCodes == null) {
            throw new CommonException("error.roleCode.null");
        } else {
            roleCodes.forEach(code -> {
                RoleDO role = roleRepository.selectByCode(code);
                if (role == null) {
                    throw new CommonException("error.role.not.existed");
                }
                if (!role.getLevel().equals(sourceType)) {
                    throw new CommonException("error.illegal.role.level");
                }
                roles.add(role);
            });
        }
        return roles;
    }

    private void validateSourceType(UserDO user, Long sourceId, String sourceType) {
        ResourceLevelValidator.validate(sourceType);
        if (ResourceLevel.SITE.value().equals(sourceType)
                || ResourceLevel.USER.value().equals(sourceType)) {
            throw new CommonException("error.illegal.sourceType");
        } else if (ResourceLevel.PROJECT.value().equals(sourceType)) {
            ProjectDO projectDO = projectRepository.selectByPrimaryKey(sourceId);
            if (projectDO == null) {
                throw new CommonException("error.project.not.existed");
            }
            Long organizationId = projectDO.getOrganizationId();
            user.setOrganizationId(organizationId);
        } else {
            //organization level
            if (organizationRepository.selectByPrimaryKey(sourceId) == null) {
                throw new CommonException("error.organization.not.existed");
            }
            user.setOrganizationId(sourceId);
        }
    }

    @Override
    public Long queryOrgIdByEmail(String email) {
        UserDO userDO = new UserDO();
        userDO.setEmail(email);
        UserDO userDO1 = userRepository.selectOne(userDO);
        if (null == userDO1) {
            throw new CommonException("error.user.email.not.exist");
        }
        return userDO1.getOrganizationId();
    }

    @Override
    public OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId) {
        OrganizationProjectDTO organizationProjectDTO = new OrganizationProjectDTO();
        organizationProjectDTO.setOrganizationList(organizationRepository.selectFromMemberRoleByMemberId(userId, false).stream().map(organizationDO ->
                OrganizationProjectDTO.newInstanceOrganization(organizationDO.getId(), organizationDO.getName(), organizationDO.getCode())
        ).collect(Collectors.toList()));
        ProjectDO projectDO = new ProjectDO();
        //查询启用的项目
        projectDO.setEnabled(true);
        organizationProjectDTO.setProjectList(projectRepository.selectProjectsFromMemberRoleByOptions(userId, projectDO)
                .stream().map(projectDO1 ->
                        OrganizationProjectDTO.newInstanceProject(projectDO1.getId(), projectDO1.getName(), projectDO1.getCode())).collect(Collectors.toList()));
        return organizationProjectDTO;
    }

    @Override
    public Page<SimplifiedUserDTO> pagingQueryAllUser(PageRequest pageRequest, String param) {
        return userRepository.pagingAllUsersByParams(pageRequest, param);
    }

    @Override
    public Page<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, PageRequest pageRequest, String param) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersOnSiteLevel(userId, email, pageRequest, param), UserDTO.class);
    }
}