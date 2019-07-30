package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.notify.NoticeSendDTO;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.api.dto.payload.UserEventPayload;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import io.choerodon.iam.api.validator.UserPasswordValidator;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.asserts.*;
import io.choerodon.iam.infra.common.utils.ImageUtils;
import io.choerodon.iam.infra.common.utils.PageUtils;
import io.choerodon.iam.infra.common.utils.ParamUtils;
import io.choerodon.iam.infra.dto.MemberRoleDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.feign.FileFeignClient;
import io.choerodon.iam.infra.feign.NotifyFeignClient;
import io.choerodon.iam.infra.mapper.*;
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
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.Future;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.User.USER_UPDATE;
import static io.choerodon.iam.infra.asserts.UserAssertHelper.WhichColumn;

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
    private PasswordRecord passwordRecord;
    private FileFeignClient fileFeignClient;
    private BasePasswordPolicyMapper basePasswordPolicyMapper;
    private PasswordPolicyManager passwordPolicyManager;
    private UserPasswordValidator userPasswordValidator;
    private SagaClient sagaClient;
    private MemberRoleMapper memberRoleMapper;
    private final ObjectMapper mapper = new ObjectMapper();
    private ProjectMapCategoryMapper projectMapCategoryMapper;
    private NotifyFeignClient notifyFeignClient;
    private UserMapper userMapper;

    private UserAssertHelper userAssertHelper;

    private OrganizationAssertHelper organizationAssertHelper;

    private ProjectMapper projectMapper;

    private OrganizationMapper organizationMapper;
    private ProjectAssertHelper projectAssertHelper;
    private RoleAssertHelper roleAssertHelper;


    public UserServiceImpl(PasswordRecord passwordRecord,
                           FileFeignClient fileFeignClient,
                           SagaClient sagaClient,
                           BasePasswordPolicyMapper basePasswordPolicyMapper,
                           UserPasswordValidator userPasswordValidator,
                           PasswordPolicyManager passwordPolicyManager,
                           MemberRoleMapper memberRoleMapper,
                           ProjectMapCategoryMapper projectMapCategoryMapper,
                           NotifyFeignClient notifyFeignClient,
                           UserMapper userMapper,
                           UserAssertHelper userAssertHelper,
                           OrganizationAssertHelper organizationAssertHelper,
                           ProjectMapper projectMapper,
                           OrganizationMapper organizationMapper,
                           ProjectAssertHelper projectAssertHelper,
                           RoleAssertHelper roleAssertHelper) {
        this.passwordRecord = passwordRecord;
        this.fileFeignClient = fileFeignClient;
        this.sagaClient = sagaClient;
        this.basePasswordPolicyMapper = basePasswordPolicyMapper;
        this.passwordPolicyManager = passwordPolicyManager;
        this.userPasswordValidator = userPasswordValidator;
        this.memberRoleMapper = memberRoleMapper;
        this.projectMapCategoryMapper = projectMapCategoryMapper;
        this.notifyFeignClient = notifyFeignClient;
        this.userMapper = userMapper;
        this.userAssertHelper = userAssertHelper;
        this.organizationAssertHelper = organizationAssertHelper;
        this.projectMapper = projectMapper;
        this.organizationMapper = organizationMapper;
        this.projectAssertHelper = projectAssertHelper;
        this.roleAssertHelper = roleAssertHelper;
    }

    @Override
    public UserDTO querySelf() {
        CustomUserDetails customUserDetails = DetailsHelperAssert.userDetailNotExisted();
        Long userId = customUserDetails.getUserId();
        UserDTO userDTO = userMapper.selectByPrimaryKey(userId);
        if (userDTO != null) {
            OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(userDTO.getOrganizationId());
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
        CustomUserDetails customUserDetails = DetailsHelperAssert.userDetailNotExisted();
        if (!userId.equals(customUserDetails.getUserId())) {
            throw new CommonException(USER_ID_NOT_EQUAL_EXCEPTION);
        }
        boolean isAdmin = false;
        if (customUserDetails.getAdmin() != null) {
            isAdmin = customUserDetails.getAdmin();
        }
        //superAdmin例外处理
        if (isAdmin) {
            return organizationMapper.selectAll();
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
        List<ProjectDTO> projects;
        //superAdmin例外处理
        if (isAdmin) {
            projects = projectMapper.selectAll();
        } else {
            ProjectDTO project = new ProjectDTO();
            if (!includedDisabled) {
                project.setEnabled(true);
            }
            projects = projectMapper.selectProjectsByUserId(id, project);
        }
        if (enableCategory) {
            projects = mergeCategories(projects);
        }
        return projects;
    }

    private List<ProjectDTO> mergeCategories(List<ProjectDTO> projectDTOS) {
        List<ProjectMapCategorySimpleDTO> projectMapCategorySimpleDTOS = projectMapCategoryMapper.selectAllProjectMapCategories();
        projectDTOS.forEach(p -> {
            List<ProjectCategoryDTO> collectCategories = new ArrayList<>();
            List<String> collect = projectMapCategorySimpleDTOS.stream().filter(c -> c.getProjectId().equals(p.getId())).map(c -> c.getCategory()).collect(Collectors.toList());
            for (String collectOne : collect) {
                ProjectCategoryDTO projectCategoryDTO = new ProjectCategoryDTO();
                projectCategoryDTO.setName(collectOne);
                collectCategories.add(projectCategoryDTO);
            }
            List<ProjectCategoryDTO> categories = new ArrayList<>();
            categories.addAll(collectCategories);
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
    public PageInfo<UserDTO> pagingQueryUsersWithRoles(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                       Long sourceId, ResourceType resourceType) {
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        boolean doPage = (size != 0);
        Page<UserDTO> result = new Page<>(page, size);
        if (doPage) {
            int start = PageUtils.getBegin(page, size);
            int count = userMapper.selectCountUsers(roleAssignmentSearchDTO, sourceId, resourceType.value(),
                    ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            List<UserDTO> users =
                    userMapper.selectUserWithRolesByOption(
                            roleAssignmentSearchDTO, sourceId, resourceType.value(), start, size,
                            ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            result.setTotal(count);
            result.addAll(users);
        } else {
            List<UserDTO> users =
                    userMapper.selectUserWithRolesByOption(roleAssignmentSearchDTO, sourceId, resourceType.value(), null, null,
                            ParamUtils.arrToStr(roleAssignmentSearchDTO.getParam()));
            result.setTotal(users.size());
            result.addAll(users);
        }
        return result.toPageInfo();
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage) {
        return pagingQueryUsersByRoleIdAndLevel(pageRequest, roleAssignmentSearchDTO, roleId, 0L, ResourceLevel.SITE.value(), doPage);
    }

    private PageInfo<UserDTO> pagingQueryUsersByRoleIdAndLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, String level, boolean doPage) {
        String param = Optional.ofNullable(roleAssignmentSearchDTO).map(dto -> ParamUtils.arrToStr(dto.getParam())).orElse(null);
        if (!doPage) {
            List<UserDTO> users =
                    userMapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                            level, roleAssignmentSearchDTO, param);
            Page<UserDTO> result = new Page<>();
            result.addAll(users);
            return result.toPageInfo();
        }
        return PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize()).doSelectPageInfo(() -> userMapper.selectUsersFromMemberRoleByOptions(roleId, "user", sourceId,
                level, roleAssignmentSearchDTO, param));
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return pagingQueryUsersByRoleIdAndLevel(pageRequest, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.ORGANIZATION.value(), doPage);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, boolean doPage) {
        return pagingQueryUsersByRoleIdAndLevel(pageRequest, roleAssignmentSearchDTO, roleId, sourceId, ResourceLevel.PROJECT.value(), doPage);
    }

    @Override
    public String uploadPhoto(Long id, MultipartFile file) {
        checkLoginUser(id);
        return fileFeignClient.uploadFile("iam-service", file.getOriginalFilename(), file).getBody();
    }


    @Override
    public String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height) {
        checkLoginUser(id);
        UserDTO dto = userAssertHelper.userNotExisted(id);
        try {
            file = ImageUtils.cutImage(file, rotate, axisX, axisY, width, height);
            String photoUrl = fileFeignClient.uploadFile("iam-service", file.getOriginalFilename(), file).getBody();
            dto.setImageUrl(photoUrl);
            if (userMapper.updateByPrimaryKeySelective(dto) != 1) {
                throw new CommonException("error.user.update");
            }
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
        List<OrganizationDTO> resultOrganizations = organizationMapper.selectFromMemberRoleByMemberId(userId, includedDisabled);
        List<OrganizationDTO> notIntoOrganizations = organizationMapper.selectOrgByUserAndPros(userId, includedDisabled);
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
    public void selfUpdatePassword(Long userId, UserPasswordDTO userPasswordDTO, Boolean checkPassword, Boolean checkLogin) {
        if (checkLogin) {
            checkLoginUser(userId);
        }
        UserDTO user = userAssertHelper.userNotExisted(userId);
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
            OrganizationDTO organizationDTO = organizationMapper.selectByPrimaryKey(user.getOrganizationId());
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
        updateSelective(user);
        passwordRecord.updatePassword(user.getId(), user.getPassword());

        // send siteMsg
        Map<String, Object> paramsMap = new HashMap<>();
        paramsMap.put("userName", user.getRealName());
        List<Long> userIds = new ArrayList<>();
        userIds.add(user.getId());
        sendNotice(user.getId(), userIds, "modifyPassword", paramsMap, 0L);
    }

    private UserDTO updateSelective(UserDTO userDTO) {
        userAssertHelper.objectVersionNumberNotNull(userDTO.getObjectVersionNumber());
        if (userMapper.updateByPrimaryKeySelective(userDTO) != 1) {
            throw new UpdateExcetion("error.user.update");
        }
        return userMapper.selectByPrimaryKey(userDTO);
    }

    @Override
    public UserDTO queryInfo(Long userId) {
        checkLoginUser(userId);
        UserDTO user = userAssertHelper.userNotExisted(userId);
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(user.getOrganizationId());
        user.setOrganizationName(organizationDTO.getName());
        user.setOrganizationCode(organizationDTO.getCode());
        return user;
    }

    @Override
    public RegistrantInfoDTO queryRegistrantInfoAndAdmin(String orgCode) {
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(orgCode);
        Long userId = organizationDTO.getUserId();
        UserDTO user = userAssertHelper.userNotExisted(userId);
        UserDTO admin = userAssertHelper.userNotExisted(WhichColumn.LOGIN_NAME, "admin");
        RegistrantInfoDTO registrantInfoDTO = new RegistrantInfoDTO();
        registrantInfoDTO.setUser(user);
        registrantInfoDTO.setOrganizationName(organizationDTO.getName());
        registrantInfoDTO.setAdminId(admin.getId());
        return registrantInfoDTO;
    }

    @Override
    @Transactional
    public UserDTO updateInfo(UserDTO userDTO, Boolean checkLogin) {
        if (checkLogin) {
            checkLoginUser(userDTO.getId());
        }
        UserDTO dto;
        if (devopsMessage) {
            UserEventPayload userEventPayload = new UserEventPayload();
            dto = updateSelective(userDTO);
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
            dto = updateSelective(userDTO);
        }
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(dto.getOrganizationId());
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
            Boolean existed = userMapper.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.phone.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userMapper.selectOne(userDTO);
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
            Boolean existed = userMapper.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.email.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userMapper.selectOne(userDTO);
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
            Boolean existed = userMapper.selectOne(userDTO) != null;
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }
        } else {
            Long id = user.getId();
            UserDTO dto = userMapper.selectOne(userDTO);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.user.loginName.exist");
            }

        }
    }

    @Override
    public UserDTO queryByLoginName(String loginName) {
        UserDTO dto = new UserDTO();
        dto.setLoginName(loginName);
        return userMapper.selectOne(dto);
    }

    @Override
    public UserDTO lockUser(Long userId, Integer lockExpireTime) {
        UserDTO userDTO = userAssertHelper.userNotExisted(userId);
        userDTO.setLocked(true);
        userDTO.setLockedUntilAt(new Date(System.currentTimeMillis() + lockExpireTime * 1000));
        return updateSelective(userDTO);
    }

    @Override
    public PageInfo<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest, UserDTO userDTO, String params) {
        userDTO.setAdmin(true);
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> userMapper.selectAdminUserPage(userDTO, params));
    }

    @Override
    @Transactional
    public void addAdminUsers(long[] ids) {
        for (long id : ids) {
            UserDTO dto = userMapper.selectByPrimaryKey(id);
            if (dto != null && !dto.getAdmin()) {
                dto.setAdmin(true);
                updateSelective(dto);
            }
        }
    }

    @Override
    public void deleteAdminUser(long id) {
        UserDTO dto = userAssertHelper.userNotExisted(id);
        UserDTO userDTO = new UserDTO();
        userDTO.setAdmin(true);
        if (userMapper.selectCount(userDTO) > 1) {
            if (dto.getAdmin()) {
                dto.setAdmin(false);
                updateSelective(dto);
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
            return userMapper.listUsersByIds(ids, onlyEnabled);
        }
    }

    @Override
    public List<UserDTO> listUsersByEmails(String[] emails) {
        if (ObjectUtils.isEmpty(emails)) {
            return new ArrayList<>();
        } else {
            return userMapper.listUsersByEmails(emails);
        }
    }

    @Override
    public List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled) {
        if (ObjectUtils.isEmpty(loginNames)) {
            return new ArrayList<>();
        } else {
            return userMapper.listUsersByLoginNames(loginNames, onlyEnabled);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserInfoDTO updateUserInfo(Long id, UserInfoDTO userInfoDTO) {
        // 更新用户密码
        UserPasswordDTO passwordDTO = new UserPasswordDTO();
        passwordDTO.setOriginalPassword(userInfoDTO.getOriginalPassword());
        passwordDTO.setPassword(userInfoDTO.getPassword());
        selfUpdatePassword(id, passwordDTO, true, false);
        // 更新用户名
        String userName = userInfoDTO.getUserName();
        if (!StringUtils.isEmpty(userName)) {
            UserDTO user = userMapper.selectByPrimaryKey(id);
            user.setRealName(userName);
            updateInfo(user, false);
        }
        return userInfoDTO;
    }

    @Override
    public PageInfo<OrganizationDTO> pagingQueryOrganizationsWithRoles(PageRequest pageRequest, Long id, String params) {
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        Page<OrganizationDTO> result = new Page<>(page, size);
        int start = PageUtils.getBegin(page, size);
        int count = memberRoleMapper.selectCountBySourceId(id, "organization");
        result.setTotal(count);
        result.addAll(organizationMapper.selectOrganizationsWithRoles(id, start, size, params));
        return result.toPageInfo();
    }

    @Override
    public PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(PageRequest pageRequest, Long id, String params) {
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        Page<ProjectDTO> result = new Page<>(page, size);
        if (size == 0) {
            List<ProjectDTO> projectList = projectMapper.selectProjectsWithRoles(id, null, null, params);
            result.setTotal(projectList.size());
            result.addAll(projectList);
        } else {
            int start = PageUtils.getBegin(page, size);
            int count = memberRoleMapper.selectCountBySourceId(id, "project");
            result.setTotal(count);
            List<ProjectDTO> projectList = projectMapper.selectProjectsWithRoles(id, start, size, params);
            result.addAll(projectList);
        }
        return result.toPageInfo();
    }

    @Override
    @Transactional
    public UserDTO createUserAndAssignRoles(final CreateUserWithRolesDTO userWithRoles) {
        List<RoleDTO> roles = validateRoles(userWithRoles);
        UserDTO user = validateUser(userWithRoles);
        if (userMapper.insertSelective(user) != 1) {
            throw new CommonException("error.user.create");
        }
        UserDTO userDTO = userMapper.selectByPrimaryKey(user);
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
                                                        PageRequest pageRequest, String params) {
        CustomUserDetails customUserDetails = DetailsHelperAssert.userDetailNotExisted();
        Long userId = customUserDetails.getUserId();
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> projectMapper.selectProjectsByUserIdWithParam(userId, projectDTO, params));
    }

    @Override
    public PageInfo<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                                  PageRequest pageRequest, String params) {
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> organizationMapper.selectOrganizationsByUserId(customUserDetails.getUserId(), organizationDTO, params));
    }

    @Override
    public Long[] listUserIds() {
        return userMapper.listUserIds();
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
        userAssertHelper.loginNameExisted(loginName);
        userAssertHelper.emailExisted(email);
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
                RoleDTO role = roleAssertHelper.roleNotExisted(code);
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
            ProjectDTO projectDTO = projectAssertHelper.projectNotExisted(sourceId);
            Long organizationId = projectDTO.getOrganizationId();
            user.setOrganizationId(organizationId);
        } else {
            //organization level
            organizationAssertHelper.organizationNotExisted(sourceId);
            user.setOrganizationId(sourceId);
        }
    }

    @Override
    public Long queryOrgIdByEmail(String email) {
        return userAssertHelper.userNotExisted(WhichColumn.EMAIL, email).getOrganizationId();
    }

    @Override
    public OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId) {
        OrganizationProjectDTO organizationProjectDTO = new OrganizationProjectDTO();
        organizationProjectDTO.setOrganizationList(organizationMapper.selectFromMemberRoleByMemberId(userId, false).stream().map(organizationDO ->
                OrganizationProjectDTO.newInstanceOrganization(organizationDO.getId(), organizationDO.getName(), organizationDO.getCode())
        ).collect(Collectors.toList()));
        ProjectDTO projectDTO = new ProjectDTO();
        //查询启用的项目
        projectDTO.setEnabled(true);
        organizationProjectDTO.setProjectList(projectMapper.selectProjectsByUserId(userId, projectDTO)
                .stream().map(projectDO1 ->
                        OrganizationProjectDTO.newInstanceProject(projectDO1.getId(), projectDO1.getName(), projectDO1.getCode())).collect(Collectors.toList()));
        return organizationProjectDTO;
    }

    @Override
    public PageInfo<SimplifiedUserDTO> pagingQueryAllUser(PageRequest pageRequest, String param, Long organizationId) {
        if (StringUtils.isEmpty(param) && Long.valueOf(0).equals(organizationId)) {
            Page<SimplifiedUserDTO> result = new Page<>(0, 20);
            result.setTotal(0);
            return result.toPageInfo();
        }
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        if (organizationId.equals(0L)) {
            return PageHelper.startPage(page, size).doSelectPageInfo(() -> userMapper.selectAllUsersSimplifiedInfo(param));
        } else {
            return PageHelper.startPage(page, size).doSelectPageInfo(() -> userMapper.selectUsersOptional(param, organizationId));
        }
    }

    @Override
    public PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, PageRequest pageRequest, String param) {
        return
                PageHelper
                        .startPage(pageRequest.getPage(), pageRequest.getSize())
                        .doSelectPageInfo(() -> userMapper.selectUsersByLevelAndOptions(ResourceLevel.SITE.value(), 0L, userId, email, param));
    }

    @Override
    public Map<String, Object> queryAllAndNewUsers() {
        Map<String, Object> map = new HashMap<>();
        UserDTO dto = new UserDTO();
        map.put("allUsers", userMapper.selectCount(dto));
        LocalDate localDate = LocalDate.now();
        String begin = localDate.toString();
        String end = localDate.plusDays(1).toString();
        map.put("newUsers", userMapper.newUsersByDate(begin, end));
        return map;
    }

    @Override
    public PageInfo<UserRoleDTO> pagingQueryRole(PageRequest pageRequest, String param, Long userId, Long organizationId) {
        CustomUserDetails customUserDetails = DetailsHelperAssert.userDetailNotExisted();
        Long id = customUserDetails.getUserId();
        if (!id.equals(userId)) {
            throw new CommonException("error.permission.id.notMatch");
        }
        PageInfo<UserRoleDTO> result = PageHelper.startPage(pageRequest.getPage(), pageRequest.getSize()).doSelectPageInfo(() -> userMapper.selectRoles(userId, param, organizationId));
        result.getList().forEach(i -> {
            String[] roles = i.getRoleNames().split(",");
            List<RoleNameAndEnabledDTO> list = new ArrayList<>(roles.length);
            for (int j = 0; j < roles.length; j++) {
                String[] nameAndEnabled = roles[j].split("\\|");
                boolean roleEnabled = true;
                if (nameAndEnabled[2].equals("0")) {
                    roleEnabled = false;
                }
                list.add(new RoleNameAndEnabledDTO(nameAndEnabled[0], nameAndEnabled[1], roleEnabled));
            }
            i.setRoles(list);
            if (ResourceLevel.PROJECT.value().equals(i.getLevel())) {
                i.setOrganizationId(projectMapper.selectByPrimaryKey(i.getId()).getOrganizationId());
            }
        });
        return result;
    }

    @Override
    @Async("notify-executor")
    public Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code,
                                     Map<String, Object> params, Long sourceId) {
        return sendNotice(fromUserId, userIds, code, params, sourceId, false);
    }

    @Override
    @Async("notify-executor")
    public Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code, Map<String, Object> params, Long sourceId, boolean sendAll) {
        LOGGER.info("ready : send Notice to {} users", userIds.size());
        if (userIds == null || userIds.isEmpty()) {
            return new AsyncResult<>("userId is null");
        }
        long beginTime = System.currentTimeMillis();
        NoticeSendDTO noticeSendDTO = new NoticeSendDTO();
        noticeSendDTO.setCode(code);
        NoticeSendDTO.User currentUser = new NoticeSendDTO.User();
        currentUser.setId(fromUserId);
        noticeSendDTO.setFromUser(currentUser);
        noticeSendDTO.setParams(params);
        noticeSendDTO.setSourceId(sourceId);
        List<NoticeSendDTO.User> users = new LinkedList<>();
        userIds.forEach(id -> {
            NoticeSendDTO.User user = new NoticeSendDTO.User();
            user.setId(id);
            //如果是发送给所有人，我们无需查看是否有角色分配，全部发送，避免查表
            if (!sendAll) {
                UserDTO userDTO = userMapper.selectByPrimaryKey(id);
                if (userDTO != null) {
                    //有角色分配，但是角色已经删除
                    user.setEmail(userDTO.getEmail());
                    users.add(user);
                }
            } else {
                users.add(user);
            }
        });
        noticeSendDTO.setTargetUsers(users);
        LOGGER.info("start : send Notice to {} users", userIds.size());
        notifyFeignClient.postNotice(noticeSendDTO);
        LOGGER.info("end : send Notice to {} users", userIds.size());
        return new AsyncResult<>((System.currentTimeMillis() - beginTime) / 1000 + "s");
    }

    @Override
    public UserDTO updateUserDisabled(Long userId) {
        UserDTO userDTO = userAssertHelper.userNotExisted(userId);
        userDTO.setEnabled(false);
        return updateSelective(userDTO);
    }
}