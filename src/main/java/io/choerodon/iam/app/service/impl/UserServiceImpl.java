package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.api.validator.UserPasswordValidator;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.repository.RoleRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.common.utils.ImageUtils;
import io.choerodon.iam.infra.dto.*;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper;
import io.choerodon.oauth.core.password.PasswordPolicyManager;
import io.choerodon.oauth.core.password.domain.BasePasswordPolicyDTO;
import io.choerodon.oauth.core.password.domain.BaseUserDTO;
import io.choerodon.oauth.core.password.mapper.BasePasswordPolicyMapper;
import io.choerodon.oauth.core.password.record.PasswordRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.USER_UPDATE;

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
    @Value("${choerodon.category.enabled:false}")
    private boolean enableCategory;
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
    private ProjectMapCategoryMapper projectMapCategoryMapper;

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
                           MemberRoleMapper memberRoleMapper,
                           ProjectMapCategoryMapper projectMapCategoryMapper) {
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
        this.projectMapCategoryMapper = projectMapCategoryMapper;
    }

    @Override
    public UserDTO querySelf() {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException(USER_NOT_LOGIN_EXCEPTION);
        }
        Long userId = customUserDetails.getUserId();
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        if (userDTO != null && userDTO.getOrganizationId() != null) {
            OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(userDTO.getOrganizationId());
            userDTO.setOrganizationName(organizationDTO.getName());
            userDTO.setOrganizationCode(organizationDTO.getCode());
            if (userDTO.getPhone() == null || userDTO.getPhone().isEmpty()) {
                userDTO.setInternationalTelCode("");
            }
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
        boolean isAdmin = false;
        if (customUserDetails.getAdmin() != null) {
            isAdmin = customUserDetails.getAdmin();
        }
        //superAdmin例外处理
        if (isAdmin) {
            return organizationRepository.selectAll();
        } else {
            return getOwnedOrganizations(userId, includedDisabled);
        }

    }

    @Override
    public List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled) {
        CustomUserDetails customUserDetails = checkLoginUser(id);
        boolean isAdmin = false;
        if (customUserDetails.getAdmin() != null) {
            isAdmin = customUserDetails.getAdmin();
        }

        List<ProjectDTO> projectDTOS = new ArrayList<>();
        //superAdmin例外处理
        if (isAdmin) {
            projectDTOS = projectRepository.selectAll();
        } else {
            ProjectDTO project = new ProjectDTO();
            if (!includedDisabled) {
                project.setEnabled(true);
            }
            projectDTOS = projectRepository.selectProjectsFromMemberRoleByOptions(id, project);
        }
        if (enableCategory) {
            projectDTOS = mergeCategories(projectDTOS);
        }
        return projectDTOS;
    }

    private List<ProjectDTO> mergeCategories(List<ProjectDTO> projectDTOS) {
        List<ProjectMapCategorySimpleDTO> projectMapCategorySimpleDTOS = projectMapCategoryMapper.selectAllProjectMapCategories();
        projectDTOS.forEach(p -> {
            List<String> collect = projectMapCategorySimpleDTOS.stream().filter(c -> c.getProjectId().equals(p.getId())).map(c -> c.getCategory()).collect(Collectors.toList());
            List<String> categories = new ArrayList<>();
            categories.addAll(collect);
            p.setCategories(categories);
        });
        return projectDTOS;
    }

    @Override
    public List<ProjectDTO> queryProjectsByOrganizationId(Long userId, Long organizationId) {
        checkLoginUser(userId);
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setOrganizationId(organizationId);
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
    public PageInfo<UserDTO> pagingQueryUsersWithSiteLevelRoles(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO) {
        return
                userRepository.pagingQueryUsersWithSiteLevelRoles(
                        page, size, roleAssignmentSearchDTO);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId) {
        return
                userRepository.pagingQueryUsersWithOrganizationLevelRoles(
                        page, size, roleAssignmentSearchDTO, sourceId);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersWithProjectLevelRoles(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage) {
        return
                userRepository.pagingQueryUsersWithProjectLevelRoles(
                        page, size, roleAssignmentSearchDTO, sourceId, doPage);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage) {
        return userRepository.pagingQueryUsersByRoleIdAndLevel(
                page, size, roleAssignmentSearchDTO, roleId, 0L, ResourceLevel.SITE.value(), doPage);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return
                userRepository.pagingQueryUsersByRoleIdAndLevel(
                        page, size, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.ORGANIZATION.value(), doPage);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(int page, int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return
                userRepository.pagingQueryUsersByRoleIdAndLevel(
                        page, size, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.PROJECT.value(), doPage);
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
        List<OrganizationDTO> resultOrganizations = organizationRepository.selectFromMemberRoleByMemberId(userId, includedDisabled);
        List<OrganizationDTO> notIntoOrganizations = organizationRepository.selectOrgByUserAndPros(userId, includedDisabled);
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
        UserDTO user = userRepository.selectByPrimaryKey(userId);
        if (user.getLdap()) {
            throw new CommonException("error.ldap.user.can.not.update.password");
        }
        if (!ENCODER.matches(userPasswordDTO.getOriginalPassword(), user.getPassword())) {
            throw new CommonException("error.password.originalPassword");
        }
        //密码策略
        if (checkPassword) {
            BaseUserDTO baseUserDTO = new BaseUserDTO();
            BeanUtils.copyProperties(user, baseUserDTO);
            OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(user.getOrganizationId());
            if (organizationDTO != null) {
                BasePasswordPolicyDTO example = new BasePasswordPolicyDTO();
                example.setOrganizationId(organizationDTO.getId());
                BasePasswordPolicyDTO basePasswordPolicyDO = basePasswordPolicyMapper.selectOne(example);
                if (userPasswordDTO.getPassword() != null) {
                    passwordPolicyManager.passwordValidate(userPasswordDTO.getPassword(), baseUserDTO, basePasswordPolicyDO);
                }
                // 校验用户密码
                userPasswordValidator.validate(userPasswordDTO.getPassword(), organizationDTO.getId(), true);
            }
        }
        user.setPassword(ENCODER.encode(userPasswordDTO.getPassword()));
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
        UserDTO user = userRepository.selectByPrimaryKey(userId);
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(user.getOrganizationId());
        user.setOrganizationName(organizationDTO.getName());
        user.setOrganizationCode(organizationDTO.getCode());
        return user;
    }

    @Override
    public RegistrantInfoDTO queryRegistrantInfoAndAdmin(String orgCode) {
        OrganizationDTO organizationDTO = new OrganizationDTO();
        organizationDTO.setCode(orgCode);
        organizationDTO = organizationRepository.selectOne(organizationDTO);
        UserDTO user = userRepository.selectByPrimaryKey(organizationDTO.getUserId());
        UserDTO admin = userRepository.selectByLoginName("admin");
        RegistrantInfoDTO registrantInfoDTO = new RegistrantInfoDTO();
        registrantInfoDTO.setUser(user);
        registrantInfoDTO.setOrganizationName(organizationDTO.getName());
        registrantInfoDTO.setAdminId(admin.getId());
        return registrantInfoDTO;
    }

    @Override
    @Transactional
    public UserDTO updateInfo(UserDTO userDTO) {
        checkLoginUser(userDTO.getId());
        UserDTO dto;
        if (devopsMessage) {
            UserEventPayload userEventPayload = new UserEventPayload();
            dto = iUserService.updateUserInfo(userDTO);
            userEventPayload.setEmail(dto.getEmail());
            userEventPayload.setId(dto.getId().toString());
            userEventPayload.setName(dto.getRealName());
            userEventPayload.setUsername(dto.getLoginName());
            BeanUtils.copyProperties(dto, dto);
            try {
                String input = mapper.writeValueAsString(userEventPayload);
                sagaClient.startSaga(USER_UPDATE, new StartInstanceDTO(input, "user", "" + dto.getId()));
            } catch (Exception e) {
                throw new CommonException("error.UserService.updateInfo.event", e);
            }
        } else {
            dto = iUserService.updateUserInfo(userDTO);
        }
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(dto.getOrganizationId());
        dto.setOrganizationName(organizationDTO.getName());
        dto.setOrganizationCode(organizationDTO.getCode());
        return dto;
    }

    @Override
    public void check(UserDTO user) {
        Boolean checkLoginName = !StringUtils.isEmpty(user.getLoginName());
        Boolean checkEmail = !StringUtils.isEmpty(user.getEmail());
        Boolean checkPhone = !StringUtils.isEmpty(user.getPhone());

        if (!checkEmail && !checkLoginName && !checkPhone) {
            throw new CommonException("error.user.validation.fields.empty");
        }
        if (checkLoginName) {
            checkLoginName(user);
        }
        if (checkEmail) {
            checkEmail(user);
        }
        if (checkPhone) {
            checkPhone(user);
        }
    }

    /**
     * 校验在启用用户中手机号唯一
     *
     * @param user 用户信息
     */
    private void checkPhone(UserDTO user) {
        Boolean createCheck = StringUtils.isEmpty(user.getId());
        String phone = user.getPhone();
        UserDTO userDTO = new UserDTO();
        userDTO.setPhone(phone);
        userDTO.setEnabled(true);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.phone.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userRepository.selectOne(userDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.user.phone.exist");
            }
        }
    }

    private void checkEmail(UserDTO user) {
        Boolean createCheck = StringUtils.isEmpty(user.getId());
        String email = user.getEmail();
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.email.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userRepository.selectOne(userDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
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
        UserDTO userDTO = new UserDTO();
        userDTO.setLoginName(loginName);
        if (createCheck) {
            Boolean existed = userRepository.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userRepository.selectOne(userDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }

        }
    }

    @Override
    public UserDTO queryByLoginName(String loginName) {
        return userRepository.selectByLoginName(loginName);
    }

    @Override
    public UserDTO lockUser(Long userId, Integer lockExpireTime) {
        UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
        userDTO.setLocked(true);
        userDTO.setLockedUntilAt(new Date(System.currentTimeMillis() + lockExpireTime * 1000));
        return userRepository.updateSelective(userDTO);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryAdminUsers(int page, int size, UserDTO userDTO, String params) {
        return userRepository.pagingQueryAdminUsers(page, size, userDTO, params);
    }

    @Override
    @Transactional
    public void addAdminUsers(long[] ids) {
        for (long id : ids) {
            UserDTO dto = userRepository.selectByPrimaryKey(id);
            if (dto != null && !dto.getAdmin()) {
                dto.setAdmin(true);
                userRepository.updateSelective(dto);
            }
        }
    }

    @Override
    public void deleteAdminUser(long id) {
        UserDTO dto = userRepository.selectByPrimaryKey(id);
        if (dto == null) {
            throw new CommonException("error.user.not.exist");
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setAdmin(true);
        if (userRepository.selectCount(userDTO) > 1) {
            if (dto.getAdmin()) {
                dto.setAdmin(false);
                userRepository.updateSelective(dto);
            }
        } else {
            throw new CommonException("error.user.admin.size");
        }
    }

    @Override
    public List<UserDTO> listUsersByIds(Long[] ids, Boolean onlyEnabled) {
        if (ObjectUtils.isEmpty(ids)) {
            return new ArrayList<>();
        } else {
            return userRepository.listUsersByIds(ids, onlyEnabled);
        }
    }

    @Override
    public List<UserDTO> listUsersByEmails(String[] emails) {
        if (ObjectUtils.isEmpty(emails)) {
            return new ArrayList<>();
        } else {
            return userRepository.listUsersByEmails(emails);
        }
    }

    @Override
    public List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled) {
        if (ObjectUtils.isEmpty(loginNames)) {
            return new ArrayList<>();
        } else {
            return userRepository.listUsersByLoginNames(loginNames, onlyEnabled);
        }
    }

    @Override
    public PageInfo<OrganizationDTO> pagingQueryOrganizationsWithRoles(int page, int size, Long id, String params) {
        return organizationRepository.pagingQueryOrganizationAndRoleById(page, size, id, params);
    }

    @Override
    public PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(int page, int size, Long id, String params) {
        return projectRepository.pagingQueryProjectAndRolesById(page, size, id, params);
    }

    @Override
    @Transactional
    public UserDTO createUserAndAssignRoles(final CreateUserWithRolesDTO userWithRoles) {
        List<RoleDTO> roles = validateRoles(userWithRoles);
        UserDTO user = validateUser(userWithRoles);
        UserDTO userDTO = userRepository.insertSelective(user);
        Long userId = userDTO.getId();
        roles.forEach(r -> {
            MemberRoleDTO memberRole = new MemberRoleDTO();
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
        return userDTO;
    }

    @Override
    public PageInfo<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                                        int page, int size, String params) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        return projectRepository.pagingQueryByUserId(customUserDetails.getUserId(), projectDTO, page, size, params);
    }

    @Override
    public PageInfo<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                                  int page, int size, String params) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        return organizationRepository.pagingQueryByUserId(customUserDetails.getUserId(), organizationDTO, page, size, params);
    }

    @Override
    public Long[] listUserIds() {
        return userRepository.listUserIds();
    }

    private UserDTO validateUser(CreateUserWithRolesDTO userWithRoles) {
        UserDTO user = userWithRoles.getUser();
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
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);
        if (userRepository.selectOne(userDTO) != null) {
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

    private void validatePassword(UserDTO user) {
        String password = user.getPassword();
        if (StringUtils.isEmpty(password)) {
            throw new CommonException("error.user.password.empty");
        }
        Long organizationId = user.getOrganizationId();
        BaseUserDTO userDO = new BaseUserDTO();
        BeanUtils.copyProperties(user, userDO);
        BasePasswordPolicyDTO example = new BasePasswordPolicyDTO();
        example.setOrganizationId(organizationId);
        Optional.ofNullable(basePasswordPolicyMapper.selectOne(example))
                .ifPresent(passwordPolicy -> {
                    if (!password.equals(passwordPolicy.getOriginalPassword())) {
                        passwordPolicyManager.passwordValidate(password, userDO, passwordPolicy);
                    }
                });
    }

    private List<RoleDTO> validateRoles(CreateUserWithRolesDTO userWithRoles) {
        UserDTO user = userWithRoles.getUser();
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
        List<RoleDTO> roles = new ArrayList<>();
        if (roleCodes == null) {
            throw new CommonException("error.roleCode.null");
        } else {
            roleCodes.forEach(code -> {
                RoleDTO role = roleRepository.selectByCode(code);
                if (role == null) {
                    throw new CommonException("error.role.not.existed");
                }
                if (!role.getResourceLevel().equals(sourceType)) {
                    throw new CommonException("error.illegal.role.level");
                }
                roles.add(role);
            });
        }
        return roles;
    }

    private void validateSourceType(UserDTO user, Long sourceId, String sourceType) {
        ResourceLevelValidator.validate(sourceType);
        if (ResourceLevel.SITE.value().equals(sourceType)
                || ResourceLevel.USER.value().equals(sourceType)) {
            throw new CommonException("error.illegal.sourceType");
        } else if (ResourceLevel.PROJECT.value().equals(sourceType)) {
            ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(sourceId);
            if (projectDTO == null) {
                throw new CommonException("error.project.not.existed");
            }
            Long organizationId = projectDTO.getOrganizationId();
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
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(email);
        UserDTO dto = userRepository.selectOne(userDTO);
        if (null == dto) {
            throw new CommonException("error.user.email.not.exist");
        }
        return dto.getOrganizationId();
    }

    @Override
    public OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId) {
        OrganizationProjectDTO organizationProjectDTO = new OrganizationProjectDTO();
        organizationProjectDTO.setOrganizationList(organizationRepository.selectFromMemberRoleByMemberId(userId, false).stream().map(organizationDO ->
                OrganizationProjectDTO.newInstanceOrganization(organizationDO.getId(), organizationDO.getName(), organizationDO.getCode())
        ).collect(Collectors.toList()));
        ProjectDTO projectDTO = new ProjectDTO();
        //查询启用的项目
        projectDTO.setEnabled(true);
        organizationProjectDTO.setProjectList(projectRepository.selectProjectsFromMemberRoleByOptions(userId, projectDTO)
                .stream().map(projectDO1 ->
                        OrganizationProjectDTO.newInstanceProject(projectDO1.getId(), projectDO1.getName(), projectDO1.getCode())).collect(Collectors.toList()));
        return organizationProjectDTO;
    }

    @Override
    public PageInfo<SimplifiedUserDTO> pagingQueryAllUser(int page, int size, String param, Long organizationId) {
        if (StringUtils.isEmpty(param) && Long.valueOf(0).equals(organizationId)) {
            Page<SimplifiedUserDTO> result = new Page<>(0, 20);
            result.setTotal(0);
            return result.toPageInfo();
        }
        return userRepository.pagingAllUsersByParams(page, size, param, organizationId);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, int page, int size, String param) {
        return userRepository.pagingQueryUsersOnSiteLevel(userId, email, page, size, param);
    }

    @Override
    public Map<String, Object> queryAllAndNewUsers() {
        Map<String, Object> map = new HashMap<>();
        map.put("allUsers", userRepository.totalNumberOfUsers());
        map.put("newUsers", userRepository.newUsersToday());
        return map;
    }

    @Override
    public PageInfo<UserRoleDTO> pagingQueryRole(int page, int size, String param, Long userId) {
        Long id = DetailsHelper.getUserDetails().getUserId();
        if (id == null || !id.equals(userId)) {
            throw new CommonException("error.permission.id.notMatch");
        }
        return userRepository.pagingQueryRole(page, size, param, userId);
    }
}