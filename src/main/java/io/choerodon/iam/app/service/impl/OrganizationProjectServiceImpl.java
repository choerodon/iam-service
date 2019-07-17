package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.ProjectCategoryDTO;
import io.choerodon.iam.api.dto.payload.ProjectEventPayload;
import io.choerodon.iam.app.service.OrganizationProjectService;
import io.choerodon.iam.app.service.RoleMemberService;
import io.choerodon.iam.app.service.UserService;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper;
import io.choerodon.iam.infra.asserts.ProjectAssertHelper;
import io.choerodon.iam.infra.asserts.UserAssertHelper;
import io.choerodon.iam.infra.common.utils.PageUtils;
import io.choerodon.iam.infra.dto.*;
import io.choerodon.iam.infra.enums.ProjectCategory;
import io.choerodon.iam.infra.enums.RoleLabel;
import io.choerodon.iam.infra.exception.EmptyParamException;
import io.choerodon.iam.infra.exception.IllegalArgumentException;
import io.choerodon.iam.infra.exception.InsertException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.feign.AsgardFeignClient;
import io.choerodon.iam.infra.mapper.*;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.*;
import static io.choerodon.iam.infra.asserts.UserAssertHelper.WhichColumn;

/**
 * @author flyleft
 * @since 2018/3/26
 */
@Service
@RefreshScope
public class OrganizationProjectServiceImpl implements OrganizationProjectService {
    private static final String PROJECT_NOT_EXIST_EXCEPTION = "error.project.not.exist";
    public static final String PROJECT_DEFAULT_CATEGORY = "AGILE";
    public static final String PROJECT = "project";

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    @Value("${choerodon.category.enabled:false}")
    private Boolean categoryEnable;

    private SagaClient sagaClient;

    private UserService userService;

    private AsgardFeignClient asgardFeignClient;

    private ProjectMapCategoryMapper projectMapCategoryMapper;

    private ProjectRelationshipMapper projectRelationshipMapper;

    private ProjectCategoryMapper projectCategoryMapper;

    private ProjectMapper projectMapper;

    private ProjectTypeMapper projectTypeMapper;

    private RoleMapper roleMapper;

    private LabelMapper labelMapper;

    private ProjectAssertHelper projectAssertHelper;
    private OrganizationAssertHelper organizationAssertHelper;
    private UserAssertHelper userAssertHelper;

    private RoleMemberService roleMemberService;

    private final ObjectMapper mapper = new ObjectMapper();

    public OrganizationProjectServiceImpl(SagaClient sagaClient,
                                          UserService userService,
                                          AsgardFeignClient asgardFeignClient,
                                          ProjectMapCategoryMapper projectMapCategoryMapper,
                                          ProjectCategoryMapper projectCategoryMapper,
                                          ProjectMapper projectMapper,
                                          ProjectAssertHelper projectAssertHelper,
                                          ProjectTypeMapper projectTypeMapper,
                                          OrganizationAssertHelper organizationAssertHelper,
                                          UserAssertHelper userAssertHelper,
                                          RoleMapper roleMapper,
                                          LabelMapper labelMapper,
                                          ProjectRelationshipMapper projectRelationshipMapper,
                                          RoleMemberService roleMemberService) {
        this.sagaClient = sagaClient;
        this.userService = userService;
        this.asgardFeignClient = asgardFeignClient;
        this.projectMapCategoryMapper = projectMapCategoryMapper;
        this.projectCategoryMapper = projectCategoryMapper;
        this.projectMapper = projectMapper;
        this.projectAssertHelper = projectAssertHelper;
        this.organizationAssertHelper = organizationAssertHelper;
        this.projectTypeMapper = projectTypeMapper;
        this.userAssertHelper = userAssertHelper;
        this.roleMapper = roleMapper;
        this.labelMapper = labelMapper;
        this.projectRelationshipMapper = projectRelationshipMapper;
        this.roleMemberService = roleMemberService;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    @Saga(code = PROJECT_CREATE, description = "iam创建项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        List<Long> categoryIds = projectDTO.getCategoryIds();
        Boolean enabled = projectDTO.getEnabled();
        projectDTO.setEnabled(enabled == null ? true : enabled);
        ProjectDTO dto;
        if (devopsMessage) {
            dto = createProjectBySaga(projectDTO);
        } else {
            dto = create(projectDTO);
            initMemberRole(dto);
        }
        if (categoryEnable) {
            initProjectCategories(categoryIds, dto);
        }
        return dto;
    }

    @Override
    public ProjectDTO create(ProjectDTO projectDTO) {
        Long organizationId = projectDTO.getOrganizationId();
        organizationAssertHelper.organizationNotExisted(organizationId);
        projectAssertHelper.codeExisted(projectDTO.getCode(), organizationId);
        if (projectMapper.insertSelective(projectDTO) != 1) {
            throw new CommonException("error.project.create");
        }
        ProjectTypeDTO projectTypeDTO = new ProjectTypeDTO();
        projectTypeDTO.setCode(projectDTO.getType());
        if (projectDTO.getType() != null && projectTypeMapper.selectCount(projectTypeDTO) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        return projectMapper.selectByPrimaryKey(projectDTO);
    }


    private void initProjectCategories(List<Long> categoryIds, ProjectDTO dto) {
        if (CollectionUtils.isEmpty(categoryIds)) {
            //添加默认类型Agile
            List<Long> ids = new ArrayList<>();
            ProjectCategoryDTO projectCategory = new ProjectCategoryDTO();
            projectCategory.setCode(PROJECT_DEFAULT_CATEGORY);
            ProjectCategoryDTO result = projectCategoryMapper.selectOne(projectCategory);
            if (result != null) {
                ids.add(result.getId());
                dto.setCategoryIds(ids);
            }
        } else {
            categoryIds.forEach(id -> {
                ProjectMapCategoryDTO example = new ProjectMapCategoryDTO();
                example.setCategoryId(id);
                example.setProjectId(dto.getId());
                if (projectMapCategoryMapper.insertSelective(example) != 1) {
                    throw new InsertException("error.projectMapCategory.insert");
                }
            });
        }
    }

    private ProjectDTO createProjectBySaga(final ProjectDTO projectDTO) {
        ProjectEventPayload projectEventMsg = new ProjectEventPayload();
        CustomUserDetails details = DetailsHelper.getUserDetails();
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(projectDTO.getOrganizationId());
        if (details != null && details.getUserId() != 0) {
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(details.getUserId());
        } else {
            Long userId = organizationDTO.getUserId();
            UserDTO userDTO = userAssertHelper.userNotExisted(userId);
            projectEventMsg.setUserId(userId);
            projectEventMsg.setUserName(userDTO.getLoginName());
        }
        ProjectDTO dto = create(projectDTO);
        //init member_role
        projectEventMsg.setRoleLabels(initMemberRole(dto));
        projectEventMsg.setProjectId(dto.getId());
        projectEventMsg.setProjectCode(dto.getCode());
        projectEventMsg.setProjectCategory(dto.getCategory());
        projectEventMsg.setProjectName(dto.getName());
        projectEventMsg.setImageUrl(projectDTO.getImageUrl());
        projectEventMsg.setOrganizationCode(organizationDTO.getCode());
        projectEventMsg.setOrganizationName(organizationDTO.getName());
        try {
            String input = mapper.writeValueAsString(projectEventMsg);
            sagaClient.startSaga(PROJECT_CREATE, new StartInstanceDTO(input, PROJECT, dto.getId() + "", ResourceLevel.ORGANIZATION.value(), dto.getOrganizationId()));
        } catch (Exception e) {
            throw new CommonException("error.organizationProjectService.createProject.event", e);
        }
        return dto;
    }


    private Set<String> initMemberRole(ProjectDTO project) {
        List<RoleDTO> roles = roleMapper.selectRolesByLabelNameAndType(RoleLabel.PROJECT_OWNER.value(), "role", null);
        if (roles.isEmpty()) {
            throw new CommonException("error.role.not.found.by.label", RoleLabel.PROJECT_OWNER.value(), "role");
        }
        CustomUserDetails customUserDetails = DetailsHelper.getUserDetails();
        if (customUserDetails == null) {
            throw new CommonException("error.user.not.login");
        }
        Long projectId = project.getId();
        Long userId = customUserDetails.getUserId();
        Set<String> labelNames = new HashSet<>();
        roles.forEach(role -> {
            //创建项目只分配项目层的角色
            if (ResourceLevel.PROJECT.value().equals(role.getResourceLevel())) {
                //查出来的符合要求的角色，要拿出来所有的label，发送给devops处理
                List<LabelDTO> labels = labelMapper.selectByRoleId(role.getId());
                labelNames.addAll(labels.stream().map(LabelDTO::getName).collect(Collectors.toList()));
                MemberRoleDTO memberRole = new MemberRoleDTO();
                memberRole.setRoleId(role.getId());
                memberRole.setMemberType("user");
                memberRole.setMemberId(userId);
                memberRole.setSourceId(projectId);
                memberRole.setSourceType(ResourceType.PROJECT.value());
                roleMemberService.insertSelective(memberRole);
            }
        });
        return labelNames;
    }

    @Override
    public List<ProjectDTO> queryAll(ProjectDTO projectDTO) {
        return projectMapper.fulltextSearch(projectDTO, null, null, null);
    }

    @Override
    public PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, PageRequest pageRequest, String param) {
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        Page<ProjectDTO> result = new Page<>(page, size);
        boolean doPage = (pageRequest.getSize() != 0);
        if (doPage) {
            int start = PageUtils.getBegin(page, size);
            int count;
            if (categoryEnable) {
                count = projectMapper.fulltextSearchCountIgnoreProgramProject(projectDTO, param);
                result.setTotal(count);
                result.addAll(projectMapper.fulltextSearchCategory(projectDTO, param, start, size));
            } else {
                count = projectMapper.fulltextSearchCount(projectDTO, param);
                result.setTotal(count);
                result.addAll(projectMapper.fulltextSearch(projectDTO, param, start, size));
            }
        } else {
            if (categoryEnable) {
                result.addAll(projectMapper.fulltextSearchCategory(projectDTO, param, null, null));
            } else {
                result.addAll(projectMapper.fulltextSearch(projectDTO, param, null, null));
            }
            result.setTotal(result.size());
        }
        return result.toPageInfo();
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public ProjectDTO update(Long organizationId, ProjectDTO projectDTO) {
        updateCheck(projectDTO);
        projectDTO.setCode(null);
        OrganizationDTO organizationDTO = organizationAssertHelper.organizationNotExisted(projectDTO.getOrganizationId());
        ProjectDTO dto;
        if (devopsMessage) {
            dto = new ProjectDTO();
            CustomUserDetails details = DetailsHelperAssert.userDetailNotExisted();
            UserDTO user = userAssertHelper.userNotExisted(WhichColumn.LOGIN_NAME, details.getUsername());
            ProjectEventPayload projectEventMsg = new ProjectEventPayload();
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(user.getId());
            projectEventMsg.setOrganizationCode(organizationDTO.getCode());
            projectEventMsg.setOrganizationName(organizationDTO.getName());
            ProjectDTO newProjectDTO = updateSelective(projectDTO);
            projectEventMsg.setProjectId(newProjectDTO.getId());
            projectEventMsg.setProjectCode(newProjectDTO.getCode());
            projectEventMsg.setProjectName(newProjectDTO.getName());
            projectEventMsg.setImageUrl(newProjectDTO.getImageUrl());
            BeanUtils.copyProperties(newProjectDTO, dto);
            try {
                String input = mapper.writeValueAsString(projectEventMsg);
                sagaClient.startSaga(PROJECT_UPDATE, new StartInstanceDTO(input, PROJECT, newProjectDTO.getId() + "", ResourceLevel.ORGANIZATION.value(), organizationId));
            } catch (Exception e) {
                throw new CommonException("error.organizationProjectService.updateProject.event", e);
            }
        } else {
            dto = updateSelective(projectDTO);
        }
        return dto;
    }

    @Override
    public ProjectDTO updateSelective(ProjectDTO projectDTO) {
        ProjectDTO project = projectAssertHelper.projectNotExisted(projectDTO.getId());

        ProjectTypeDTO projectTypeDTO = new ProjectTypeDTO();
        projectTypeDTO.setCode(projectDTO.getType());
        if (projectDTO.getType() != null && projectTypeMapper.selectCount(projectTypeDTO) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        if (!StringUtils.isEmpty(projectDTO.getName())) {
            project.setName(projectDTO.getName());
        }
        if (!StringUtils.isEmpty(projectDTO.getCode())) {
            project.setCode(projectDTO.getCode());
        }
        if (projectDTO.getEnabled() != null) {
            project.setEnabled(projectDTO.getEnabled());
        }
        if (projectDTO.getImageUrl() != null) {
            project.setImageUrl(projectDTO.getImageUrl());
        }
        project.setType(projectDTO.getType());
        if (projectMapper.updateByPrimaryKey(project) != 1) {
            throw new UpdateExcetion("error.project.update");
        }
        ProjectDTO returnProject = projectMapper.selectByPrimaryKey(projectDTO.getId());
        if (returnProject.getType() != null) {
            ProjectTypeDTO dto = new ProjectTypeDTO();
            dto.setCode(project.getType());
            returnProject.setTypeName(projectTypeMapper.selectOne(dto).getName());
        }
        return returnProject;
    }

    private void updateCheck(ProjectDTO projectDTO) {
        String name = projectDTO.getName();
        projectAssertHelper.objectVersionNumberNotNull(projectDTO.getObjectVersionNumber());
        if (StringUtils.isEmpty(name)) {
            throw new EmptyParamException("error.project.name.empty");
        }
        if (name.length() < 1 || name.length() > 32) {
            throw new IllegalArgumentException("error.project.code.size");
        }
    }

    @Override
    @Saga(code = PROJECT_ENABLE, description = "iam启用项目", inputSchemaClass = ProjectEventPayload.class)
    @Transactional(rollbackFor = Exception.class)
    public ProjectDTO enableProject(Long organizationId, Long projectId, Long userId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        return updateProjectAndSendEvent(projectId, PROJECT_ENABLE, true, userId);
    }

    @Override
    @Saga(code = PROJECT_DISABLE, description = "iam停用项目", inputSchemaClass = ProjectEventPayload.class)
    @Transactional(rollbackFor = Exception.class)
    public ProjectDTO disableProject(Long organizationId, Long projectId, Long userId) {
        if (organizationId != null) {
            organizationAssertHelper.organizationNotExisted(organizationId);
        }
        return updateProjectAndSendEvent(projectId, PROJECT_DISABLE, false, userId);
    }

    /**
     * 启用、禁用项目且发送相应通知消息.
     *
     * @param projectId    项目Id
     * @param consumerType saga消息类型
     * @param enabled      是否启用
     * @param userId       用户Id
     * @return 项目信息
     */
    private ProjectDTO updateProjectAndSendEvent(Long projectId, String consumerType, boolean enabled, Long userId) {
        ProjectDTO projectDTO = projectMapper.selectByPrimaryKey(projectId);
        projectDTO.setEnabled(enabled);
        // 更新项目
        projectDTO = updateSelective(projectDTO);
        String category = projectDTO.getCategory();
        // 项目所属项目群Id
        Long programId = null;
        if (!enabled) {
            if (ProjectCategory.AGILE.value().equalsIgnoreCase(category)) {
                // 项目禁用时，禁用项目关联的项目群关系
                ProjectRelationshipDTO relationshipDTO = new ProjectRelationshipDTO();
                relationshipDTO.setProjectId(projectId);
                relationshipDTO.setEnabled(true);
                relationshipDTO = projectRelationshipMapper.selectOne(relationshipDTO);
                programId = updateProjectRelationShip(relationshipDTO, Boolean.FALSE);
            } else if ((ProjectCategory.PROGRAM.value().equalsIgnoreCase(category))) {
                // 项目群禁用时，禁用项目群下所有项目关系
                List<ProjectRelationshipDTO> relationshipDTOS = projectRelationshipMapper.selectProjectsByParentId(projectId, true);
                if (CollectionUtils.isNotEmpty(relationshipDTOS)) {
                    for (ProjectRelationshipDTO relationshipDTO : relationshipDTOS) {
                        updateProjectRelationShip(relationshipDTO, Boolean.FALSE);
                    }
                }
            }
        }
        // 发送通知消息
        sendEvent(consumerType, enabled, userId, programId, projectDTO);
        return projectDTO;
    }

    /**
     * 启用、禁用项目群关系.
     *
     * @param relationshipDTO 项目群关系
     * @param enabled         是否启用
     * @return 项目所属项目群Id或null
     */
    private Long updateProjectRelationShip(ProjectRelationshipDTO relationshipDTO, boolean enabled) {
        if (relationshipDTO == null || !relationshipDTO.getEnabled()) {
            return null;
        }
        relationshipDTO.setEnabled(enabled);
        if (projectRelationshipMapper.updateByPrimaryKey(relationshipDTO) != 1) {
            throw new UpdateExcetion("error.project.group.update");
        }
        if (categoryEnable) {
            ProjectCategoryDTO projectCategoryDTO = new ProjectCategoryDTO();
            projectCategoryDTO.setCode("PROGRAM_PROJECT");
            projectCategoryDTO = projectCategoryMapper.selectOne(projectCategoryDTO);

            ProjectMapCategoryDTO projectMapCategoryDTO = new ProjectMapCategoryDTO();
            projectMapCategoryDTO.setProjectId(relationshipDTO.getProjectId());
            projectMapCategoryDTO.setCategoryId(projectCategoryDTO.getId());

            if (projectMapCategoryMapper.delete(projectMapCategoryDTO) != 1) {
                throw new CommonException("error.project.map.category.delete");
            }
        }
        return relationshipDTO.getProgramId();
    }

    /**
     * 启用、禁用项目时，发送相应通知消息.
     *
     * @param consumerType saga消息类型
     * @param enabled      是否启用
     * @param userId       用户Id
     * @param programId    项目群Id
     * @param projectDTO   项目DTO
     */
    private void sendEvent(String consumerType, boolean enabled, Long userId, Long programId, ProjectDTO projectDTO) {
        Long projectId = projectDTO.getId();
        if (devopsMessage) {
            ProjectEventPayload payload = new ProjectEventPayload();
            payload.setProjectId(projectId);
            payload.setProjectCategory(projectDTO.getCategory());
            payload.setProgramId(programId);
            //saga
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(consumerType, new StartInstanceDTO(input, PROJECT, "" + payload.getProjectId(), ResourceLevel.ORGANIZATION.value(), projectDTO.getOrganizationId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationProjectService.enableOrDisableProject", e);
            }
            if (!enabled) {
                //给asgard发送禁用定时任务通知
                asgardFeignClient.disableProj(projectId);
            }
            // 给项目下所有用户发送通知
            List<Long> userIds = projectMapper.listUserIds(projectId);
            Map<String, Object> params = new HashMap<>();
            params.put("projectName", projectMapper.selectByPrimaryKey(projectId).getName());
            if (PROJECT_DISABLE.equals(consumerType)) {
                userService.sendNotice(userId, userIds, "disableProject", params, projectId);
            } else if (PROJECT_ENABLE.equals(consumerType)) {
                userService.sendNotice(userId, userIds, "enableProject", params, projectId);
            }
        }
    }

    @Override
    public void check(ProjectDTO projectDTO) {
        Boolean checkCode = !StringUtils.isEmpty(projectDTO.getCode());
        if (!checkCode) {
            throw new CommonException("error.project.code.empty");
        } else {
            checkCode(projectDTO);
        }
    }

    private void checkCode(ProjectDTO projectDTO) {
        Boolean createCheck = StringUtils.isEmpty(projectDTO.getId());
        ProjectDTO project = new ProjectDTO();
        project.setOrganizationId(projectDTO.getOrganizationId());
        project.setCode(projectDTO.getCode());
        if (createCheck) {
            Boolean existed = projectMapper.selectOne(project) != null;
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        } else {
            Long id = projectDTO.getId();
            ProjectDTO dto = projectMapper.selectOne(project);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        }
    }

    @Override
    public Map<String, Object> getProjectsByType(Long organizationId) {
        //1.获取所有类型
        List<ProjectTypeDTO> list = projectTypeMapper.selectAll();
        List<String> legend = list.stream().map(ProjectTypeDTO::getName).collect(Collectors.toList());
        List<Map<String, Object>> data = new ArrayList<>();
        //2.获取类型下所有项目名
        list.forEach(type -> {
            List<String> projectNames = projectMapper.selectProjectNameByType(type.getCode(), organizationId);
            Map<String, Object> dataMap = new HashMap<>(5);
            dataMap.put("value", projectNames.size());
            dataMap.put("name", type.getName());
            dataMap.put("projects", projectNames);
            data.add(dataMap);
        });
        //3.获取无类型的所有项目名
        List<String> projsNoType = projectMapper.selectProjectNameNoType(organizationId);
        Map<String, Object> noTypeProjectList = new HashMap<>(5);
        noTypeProjectList.put("value", projsNoType.size());
        noTypeProjectList.put("name", "无");
        noTypeProjectList.put("projects", projsNoType);
        legend.add("无");
        data.add(noTypeProjectList);
        //4.构造返回map
        Map<String, Object> map = new HashMap<>(5);
        map.put("legend", legend);
        map.put("data", data);
        return map;
    }

    @Override
    public List<ProjectDTO> getAvailableAgileProj(Long organizationId, Long projectId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        ProjectDTO projectDTO = selectCategoryByPrimaryKey(projectId);
        if (projectDTO == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (!projectDTO.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
            throw new CommonException("error.only.programs.can.configure.subprojects");
        } else {
            //组织下全部敏捷项目
            return projectMapper.selectProjsNotGroup(organizationId, projectId);
        }
    }

    @Override
    public ProjectDTO selectCategoryByPrimaryKey(Long projectId) {
        List<ProjectDTO> projects = projectMapper.selectCategoryByPrimaryKey(projectId);
        ProjectDTO dto = mergeCategories(projects);
        if (dto == null) {
            throw new CommonException("error.project.not.exist");
        }
        return dto;
    }

    private ProjectDTO mergeCategories(List<ProjectDTO> projectDTOS) {
        if (CollectionUtils.isEmpty(projectDTOS)) {
            return null;
        }
        ProjectDTO projectDTO = new ProjectDTO();
        BeanUtils.copyProperties(projectDTOS.get(0), projectDTO);
        List<ProjectCategoryDTO> categories = new ArrayList<>();
        String category = null;
        for (int i = 0; i < projectDTOS.size(); i++) {
            ProjectDTO p = projectDTOS.get(i);
            ProjectCategoryDTO projectCategoryDTO = new ProjectCategoryDTO();
            projectCategoryDTO.setCode(p.getCategory());
            categories.add(projectCategoryDTO);
            if (category == null && ProjectCategory.PROGRAM.value().equalsIgnoreCase(p.getCategory())) {
                category = ProjectCategory.PROGRAM.value();
            } else if (category == null && ProjectCategory.AGILE.value().equalsIgnoreCase(p.getCategory())) {
                category = ProjectCategory.AGILE.value();
            } else if (category == null) {
                category = p.getCategory();
            }
        }
        projectDTO.setCategory(category);
        projectDTO.setCategories(categories);
        return projectDTO;
    }

    @Override
    public ProjectDTO getGroupInfoByEnableProject(Long organizationId, Long projectId) {
        organizationAssertHelper.organizationNotExisted(organizationId);
        projectAssertHelper.projectNotExisted(projectId);
        return projectMapper.selectGroupInfoByEnableProject(organizationId, projectId);
    }

    @Override
    public List<ProjectDTO> getAgileProjects(Long organizationId, String param) {
        List<ProjectDTO> projectDTOS;
        if (categoryEnable) {
            projectDTOS = projectMapper.selectByOrgIdAndCategoryEnable(organizationId, PROJECT_DEFAULT_CATEGORY, param);
        } else {
            projectDTOS = projectMapper.selectByOrgIdAndCategory(organizationId, param);
        }
        return projectDTOS;
    }
}
