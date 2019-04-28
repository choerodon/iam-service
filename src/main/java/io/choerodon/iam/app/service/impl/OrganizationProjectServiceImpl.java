package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.*;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.enums.ResourceType;
import io.choerodon.iam.infra.dto.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.payload.ProjectEventPayload;
import io.choerodon.iam.api.service.ProjectTypeService;
import io.choerodon.iam.app.service.OrganizationProjectService;
import io.choerodon.iam.domain.repository.*;
import io.choerodon.iam.domain.service.IUserService;
import io.choerodon.iam.infra.enums.ProjectCategory;
import io.choerodon.iam.infra.enums.RoleLabel;
import io.choerodon.iam.infra.feign.AsgardFeignClient;

/**
 * @author flyleft
 * @date 2018/3/26
 */
@Service
@RefreshScope
public class OrganizationProjectServiceImpl implements OrganizationProjectService {
    private static final String ORGANIZATION_NOT_EXIST_EXCEPTION = "error.organization.not.exist";
    private static final String PROJECT_NOT_EXIST_EXCEPTION = "error.project.not.exist";
    public static final String PROJECT = "project";

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private ProjectRepository projectRepository;

    private UserRepository userRepository;

    private OrganizationRepository organizationRepository;

    private RoleRepository roleRepository;

    private MemberRoleRepository memberRoleRepository;

    private LabelRepository labelRepository;

    private SagaClient sagaClient;

    private IUserService iUserService;

    private AsgardFeignClient asgardFeignClient;

    private ProjectTypeService projectTypeService;

    private ProjectRelationshipRepository projectRelationshipRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public OrganizationProjectServiceImpl(ProjectRepository projectRepository,
                                          UserRepository userRepository,
                                          OrganizationRepository organizationRepository,
                                          RoleRepository roleRepository,
                                          MemberRoleRepository memberRoleRepository,
                                          LabelRepository labelRepository,
                                          SagaClient sagaClient,
                                          IUserService iUserService,
                                          AsgardFeignClient asgardFeignClient,
                                          ProjectTypeService projectTypeService,
                                          ProjectRelationshipRepository projectRelationshipRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.roleRepository = roleRepository;
        this.memberRoleRepository = memberRoleRepository;
        this.labelRepository = labelRepository;
        this.sagaClient = sagaClient;
        this.iUserService = iUserService;
        this.asgardFeignClient = asgardFeignClient;
        this.projectTypeService = projectTypeService;
        this.projectRelationshipRepository = projectRelationshipRepository;
    }

    @Transactional
    @Override
    @Saga(code = PROJECT_CREATE, description = "iam创建项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        if (projectDTO.getEnabled() == null) {
            projectDTO.setEnabled(true);
        }
        ProjectDTO dto;
        if (devopsMessage) {
            dto = createProjectBySaga(projectDTO);
        } else {
            dto = projectRepository.create(projectDTO);
            initMemberRole(dto);
        }
        return dto;
    }

    private ProjectDTO createProjectBySaga(final ProjectDTO projectDTO) {
        ProjectEventPayload projectEventMsg = new ProjectEventPayload();
        CustomUserDetails details = DetailsHelper.getUserDetails();
        if (details != null && details.getUserId() != 0) {
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(details.getUserId());
        } else {
            Long userId = organizationRepository.selectByPrimaryKey(projectDTO.getOrganizationId()).getUserId();
            UserDTO userDTO = userRepository.selectByPrimaryKey(userId);
            projectEventMsg.setUserId(userId);
            projectEventMsg.setUserName(userDTO.getLoginName());
        }
        ProjectDTO dto = projectRepository.create(projectDTO);
        projectEventMsg.setRoleLabels(initMemberRole(dto));
        projectEventMsg.setProjectId(dto.getId());
        projectEventMsg.setProjectCode(dto.getCode());
        projectEventMsg.setProjectCategory(dto.getCategory());
        projectEventMsg.setProjectName(dto.getName());
        projectEventMsg.setImageUrl(projectDTO.getImageUrl());
        OrganizationDTO organizationDTO =
                organizationRepository.selectByPrimaryKey(dto.getOrganizationId());
        projectEventMsg.setOrganizationCode(organizationDTO.getCode());
        projectEventMsg.setOrganizationName(organizationDTO.getName());
        try {
            String input = mapper.writeValueAsString(projectEventMsg);
            sagaClient.startSaga(PROJECT_CREATE, new StartInstanceDTO(input, PROJECT, dto.getId() + "", ResourceLevel.ORGANIZATION.value(), dto.getOrganizationId()));
        } catch (Exception e) {
            throw new CommonException("error.organizationProjectService.createProject.event", e);
        }
        return ConvertHelper.convert(dto, ProjectDTO.class);
    }


    private Set<String> initMemberRole(ProjectDTO project) {
        List<RoleDTO> roles = roleRepository.selectRolesByLabelNameAndType(RoleLabel.PROJECT_OWNER.value(), "role");
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
                List<LabelDTO> labels = labelRepository.selectByRoleId(role.getId());
                labelNames.addAll(labels.stream().map(LabelDTO::getName).collect(Collectors.toList()));
                MemberRoleDTO memberRole = new MemberRoleDTO();
                memberRole.setRoleId(role.getId());
                memberRole.setMemberType("user");
                memberRole.setMemberId(userId);
                memberRole.setSourceId(projectId);
                memberRole.setSourceType(ResourceType.PROJECT.value());
                memberRoleRepository.insertSelective(memberRole);
            }
        });
        return labelNames;
    }

    @Override
    public List<ProjectDTO> queryAll(ProjectDTO projectDTO) {
        return projectRepository.query(projectDTO);
    }

    @Override
    public PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param) {
        return projectRepository.pagingQuery(projectDTO, page, size, param);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public ProjectDTO update(Long organizationId, ProjectDTO projectDTO) {
        updateCheck(projectDTO);
        projectDTO.setCode(null);

        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(projectDTO.getOrganizationId());
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        if (projectDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.project.objectVersionNumber.empty");
        }
        ProjectDTO dto;
        if (devopsMessage) {
            dto = new ProjectDTO();
            CustomUserDetails details = DetailsHelper.getUserDetails();
            UserDTO user = userRepository.selectByLoginName(details.getUsername());
            ProjectEventPayload projectEventMsg = new ProjectEventPayload();
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(user.getId());
            projectEventMsg.setOrganizationCode(organizationDTO.getCode());
            projectEventMsg.setOrganizationName(organizationDTO.getName());
            ProjectDTO newProjectDTO = projectRepository.updateSelective(projectDTO);
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
            dto = projectRepository.updateSelective(projectDTO);
        }
        return dto;
    }

    private void updateCheck(ProjectDTO projectDTO) {
        String name = projectDTO.getName();
        Long objectVersionNumber = projectDTO.getObjectVersionNumber();
        if (StringUtils.isEmpty(name)) {
            throw new CommonException("error.project.name.empty");
        }
        if (name.length() < 1 || name.length() > 32) {
            throw new CommonException("error.project.code.size");
        }
        if (objectVersionNumber == null) {
            throw new CommonException("error.objectVersionNumber.null");
        }
    }

    @Override
    @Saga(code = PROJECT_ENABLE, description = "iam启用项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO enableProject(Long organizationId, Long projectId, Long userId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        return updateAndSendEvent(projectId, PROJECT_ENABLE, true, userId);
    }

    private ProjectDTO updateAndSendEvent(Long projectId, String consumerType, boolean enabled, Long userId) {
        ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(projectId);
        projectDTO.setEnabled(enabled);
        if (devopsMessage) {
            ProjectEventPayload payload = new ProjectEventPayload();
            payload.setProjectId(projectId);
            ProjectDTO dto = projectRepository.updateSelective(projectDTO);
            //saga
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(consumerType, new StartInstanceDTO(input, PROJECT, "" + payload.getProjectId(), ResourceLevel.ORGANIZATION.value(), projectDTO.getOrganizationId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationProjectService.enableOrDisableProject", e);
            }
            //给asgard发送禁用定时任务通知
            asgardFeignClient.disableProj(projectId);
            // 给项目下所有用户发送通知
            List<Long> userIds = projectRepository.listUserIds(projectId);
            Map<String, Object> params = new HashMap<>();
            params.put("projectName", projectRepository.selectByPrimaryKey(projectId).getName());
            if (PROJECT_DISABLE.equals(consumerType)) {
                iUserService.sendNotice(userId, userIds, "disableProject", params, projectId);
            } else if (PROJECT_ENABLE.equals(consumerType)) {
                iUserService.sendNotice(userId, userIds, "enableProject", params, projectId);
            }
            return dto;
        } else {
            return projectRepository.updateSelective(projectDTO);
        }
    }

    @Override
    public ProjectDTO disableProject(Long organizationId, Long projectId, Long userId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        return updateAndSendEvent(projectId, PROJECT_DISABLE, false, userId);
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
            Boolean existed = projectRepository.selectOne(project) != null;
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        } else {
            Long id = projectDTO.getId();
            ProjectDTO dto = projectRepository.selectOne(project);
            Boolean existed = dto != null && !id.equals(dto.getId());
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        }
    }

    @Override
    public Map<String, Object> getProjectsByType(Long organizationId) {
        //1.获取所有类型
        List<ProjectTypeDTO> list = projectTypeService.list();
        List<String> legend = list.stream().map(ProjectTypeDTO::getName).collect(Collectors.toList());
        List<Map<String, Object>> data = new ArrayList<>();
        //2.获取类型下所有项目名
        list.forEach(type -> {
            List<String> projectNames = projectRepository.selectProjectNameByTypeCode(type.getCode(), organizationId);
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("value", projectNames.size());
            dataMap.put("name", type.getName());
            dataMap.put("projects", projectNames);
            data.add(dataMap);
        });
        //3.获取无类型的所有项目名
        List<String> projsNoType = projectRepository.selectProjectNameNoType(organizationId);
        Map<String, Object> noTypeProjectList = new HashMap<>();
        noTypeProjectList.put("value", projsNoType.size());
        noTypeProjectList.put("name", "无");
        noTypeProjectList.put("projects", projsNoType);
        legend.add("无");
        data.add(noTypeProjectList);
        //4.构造返回map
        Map<String, Object> map = new HashMap<>();
        map.put("legend", legend);
        map.put("data", data);
        return map;
    }

    @Override
    public List<ProjectDTO> getAvailableAgileProj(Long organizationId, Long projectId) {
        OrganizationDTO organizationDTO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDTO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(projectId);
        if (projectDTO == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (projectDTO.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException("error.agile.projects.cannot.configure.subprojects");
        } else {
            //组织下全部敏捷项目
            List<ProjectDTO> projectDTOS = projectRepository.selectProjsNotGroup(organizationId);
            //去除已与该项目群建立关系的敏捷项目
            Set<Long> associatedProjectIds = projectRelationshipRepository.seleteProjectsByParentId(projectId).stream().map(ProjectRelationshipDTO::getProjectId).collect(Collectors.toSet());
            return projectDTOS.stream().filter(p -> !associatedProjectIds.contains(p.getId())).collect(Collectors.toList());
        }
    }
}
