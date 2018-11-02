package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.*;

import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.iam.domain.service.IUserService;
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
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.api.dto.payload.ProjectEventPayload;
import io.choerodon.iam.app.service.OrganizationProjectService;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.*;
import io.choerodon.iam.domain.service.IProjectService;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.enums.RoleLabel;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 * @date 2018/3/26
 */
@Service
@RefreshScope
public class OrganizationProjectServiceImpl implements OrganizationProjectService {
    private static final String ORGANIZATION_NOT_EXIST_EXCEPTION = "error.organization.not.exist";

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private ProjectRepository projectRepository;

    private UserRepository userRepository;

    private OrganizationRepository organizationRepository;

    private IProjectService iProjectService;

    private RoleRepository roleRepository;

    private MemberRoleRepository memberRoleRepository;

    private LabelRepository labelRepository;

    private SagaClient sagaClient;

    private IUserService iUserService;

    private final ObjectMapper mapper = new ObjectMapper();

    public OrganizationProjectServiceImpl(ProjectRepository projectRepository,
                                          UserRepository userRepository,
                                          OrganizationRepository organizationRepository,
                                          IProjectService iProjectService,
                                          RoleRepository roleRepository,
                                          MemberRoleRepository memberRoleRepository,
                                          LabelRepository labelRepository,
                                          SagaClient sagaClient,
                                          IUserService iUserService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.iProjectService = iProjectService;
        this.roleRepository = roleRepository;
        this.memberRoleRepository = memberRoleRepository;
        this.labelRepository = labelRepository;
        this.sagaClient = sagaClient;
        this.iUserService = iUserService;
    }

    @Transactional
    @Override
    @Saga(code = PROJECT_CREATE, description = "iam创建项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO createProject(ProjectDTO projectDTO) {

        if (projectDTO.getEnabled() == null) {
            projectDTO.setEnabled(true);
        }
        final ProjectE projectE = ConvertHelper.convert(projectDTO, ProjectE.class);
        ProjectDTO dto;
        if (devopsMessage) {
            dto = createProjectBySaga(projectE);
        } else {
            ProjectE newProjectE = projectRepository.create(projectE);
            initMemberRole(newProjectE);
            dto = ConvertHelper.convert(newProjectE, ProjectDTO.class);
        }
        return dto;
    }

    private ProjectDTO createProjectBySaga(final ProjectE projectE) {
        ProjectEventPayload projectEventMsg = new ProjectEventPayload();
        CustomUserDetails details = DetailsHelper.getUserDetails();
        projectEventMsg.setUserName(details.getUsername());
        projectEventMsg.setUserId(details.getUserId());
        ProjectE newProjectE = projectRepository.create(projectE);
        projectEventMsg.setRoleLabels(initMemberRole(newProjectE));
        projectEventMsg.setProjectId(newProjectE.getId());
        projectEventMsg.setProjectCode(newProjectE.getCode());
        projectEventMsg.setProjectName(newProjectE.getName());
        OrganizationDO organizationDO =
                organizationRepository.selectByPrimaryKey(newProjectE.getOrganizationId());
        projectEventMsg.setOrganizationCode(organizationDO.getCode());
        projectEventMsg.setOrganizationName(organizationDO.getName());
        try {
            String input = mapper.writeValueAsString(projectEventMsg);
            sagaClient.startSaga(PROJECT_CREATE, new StartInstanceDTO(input, "project", newProjectE.getId() + ""));
        } catch (Exception e) {
            throw new CommonException("error.organizationProjectService.createProject.event", e);
        }
        return ConvertHelper.convert(newProjectE, ProjectDTO.class);
    }


    private Set<String> initMemberRole(ProjectE project) {
        List<RoleDO> roles = roleRepository.selectRolesByLabelNameAndType(RoleLabel.PROJECT_OWNER.value(), "role");
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
            if (ResourceLevel.PROJECT.value().equals(role.getLevel())) {
                //查出来的符合要求的角色，要拿出来所有的label，发送给devops处理
                List<LabelDO> labels = labelRepository.selectByRoleId(role.getId());
                labelNames.addAll(labels.stream().map(LabelDO::getName).collect(Collectors.toList()));
                MemberRoleE memberRole =
                        new MemberRoleE(null, role.getId(), userId, "user", projectId, ResourceLevel.PROJECT.value());
                memberRoleRepository.insertSelective(memberRole);
            }
        });
        return labelNames;
    }

    @Override
    public List<ProjectDTO> queryAll(ProjectDTO projectDTO) {
        ProjectDO projectDO = ConvertHelper.convert(projectDTO, ProjectDO.class);
        return ConvertHelper.convertList(projectRepository.query(projectDO), ProjectDTO.class);
    }

    @Override
    public Page<ProjectDTO> pagingQuery(ProjectDTO projectDTO, PageRequest pageRequest, String param) {
        ProjectDO projectDO = ConvertHelper.convert(projectDTO, ProjectDO.class);
        return ConvertPageHelper.convertPage(projectRepository.pagingQuery(
                projectDO, pageRequest, param), ProjectDTO.class);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public ProjectDTO update(Long organizationId, ProjectDTO projectDTO) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(projectDTO.getOrganizationId());
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        if (projectDTO.getObjectVersionNumber() == null) {
            throw new CommonException("error.project.objectVersionNumber.empty");
        }
        ProjectDO projectDO = ConvertHelper.convert(projectDTO, ProjectDO.class);
        ProjectDTO dto;
        if (devopsMessage) {
            dto = new ProjectDTO();
            CustomUserDetails details = DetailsHelper.getUserDetails();
            UserE user = userRepository.selectByLoginName(details.getUsername());
            ProjectEventPayload projectEventMsg = new ProjectEventPayload();
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(user.getId());
            projectEventMsg.setOrganizationCode(organizationDO.getCode());
            projectEventMsg.setOrganizationName(organizationDO.getName());
            ProjectE newProjectE = projectRepository.updateSelective(projectDO);
            projectEventMsg.setProjectId(newProjectE.getId());
            projectEventMsg.setProjectCode(newProjectE.getCode());
            projectEventMsg.setProjectName(newProjectE.getName());
            BeanUtils.copyProperties(newProjectE, dto);
            try {
                String input = mapper.writeValueAsString(projectEventMsg);
                sagaClient.startSaga(PROJECT_UPDATE, new StartInstanceDTO(input, "project", newProjectE.getId() + ""));
            } catch (Exception e) {
                throw new CommonException("error.organizationProjectService.updateProject.event", e);
            }
        } else {
            dto = ConvertHelper.convert(projectRepository.updateSelective(projectDO), ProjectDTO.class);
        }
        return dto;
    }

    @Override
    @Saga(code = PROJECT_ENABLE, description = "iam启用项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO enableProject(Long organizationId, Long projectId, Long userId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        ProjectE project = updateAndSendEvent(projectId, PROJECT_ENABLE, true, userId);
        return ConvertHelper.convert(project, ProjectDTO.class);
    }

    private ProjectE updateAndSendEvent(Long projectId, String consumerType, boolean enabled, Long userId) {
        ProjectE project;
        ProjectDO projectDO = projectRepository.selectByPrimaryKey(projectId);
        projectDO.setEnabled(enabled);
        if (devopsMessage) {
            project = new ProjectE();
            ProjectEventPayload payload = new ProjectEventPayload();
            payload.setProjectId(projectId);
            BeanUtils.copyProperties(projectRepository.updateSelective(projectDO), project);
            //saga
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(consumerType, new StartInstanceDTO(input, "project", "" + payload.getProjectId()));
            } catch (Exception e) {
                throw new CommonException("error.organizationProjectService.enableOrDisableProject", e);
            }
            // 给项目下所有用户发送通知
            List<Long> userIds = projectRepository.listUserIds(projectId);
            Map<String, Object> params = new HashMap<>();
            params.put("projectName", projectRepository.selectByPrimaryKey(projectId).getName());
            if (PROJECT_DISABLE.equals(consumerType)) {
                iUserService.sendNotice(userId, userIds, "disableProject", params);
            } else if (PROJECT_ENABLE.equals(consumerType)) {
                iUserService.sendNotice(userId, userIds, "enableProject", params);
            }
        } else {
            project = projectRepository.updateSelective(projectDO);
            //project = iProjectService.updateProjectEnabled(projectId);
        }
        return project;
    }

    @Override
    public ProjectDTO disableProject(Long organizationId, Long projectId, Long userId) {
        OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(organizationId);
        if (organizationDO == null) {
            throw new CommonException(ORGANIZATION_NOT_EXIST_EXCEPTION);
        }
        ProjectE project = updateAndSendEvent(projectId, PROJECT_DISABLE, false, userId);
        return ConvertHelper.convert(project, ProjectDTO.class);
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
        ProjectDO project = new ProjectDO();
        project.setOrganizationId(projectDTO.getOrganizationId());
        project.setCode(projectDTO.getCode());
        if (createCheck) {
            Boolean existed = projectRepository.selectOne(project) != null;
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        } else {
            Long id = projectDTO.getId();
            ProjectDO projectDO = projectRepository.selectOne(project);
            Boolean existed = projectDO != null && !id.equals(projectDO.getId());
            if (existed) {
                throw new CommonException("error.project.code.exist");
            }
        }
    }
}
