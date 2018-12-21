package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.api.dto.payload.ProjectEventPayload;
import io.choerodon.iam.app.service.ProjectService;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.domain.repository.OrganizationRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.repository.UserRepository;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.PROJECT_DISABLE;
import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.PROJECT_UPDATE;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * @author flyleft
 */
@Service
@RefreshScope
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;

    private UserRepository userRepository;

    private OrganizationRepository organizationRepository;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository,
                              OrganizationRepository organizationRepository,
                              SagaClient sagaClient) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.sagaClient = sagaClient;
    }

    @Override
    public ProjectDTO queryProjectById(Long projectId) {
        return ConvertHelper.convert(projectRepository.selectByPrimaryKey(projectId), ProjectDTO.class);
    }

    @Override
    public Page<UserDTO> pagingQueryTheUsersOfProject(Long id, Long userId, String email, PageRequest pageRequest, String param) {
        return ConvertPageHelper.convertPage(
                userRepository.pagingQueryUsersByProjectId(id, userId, email, pageRequest, param), UserDTO.class);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = PROJECT_UPDATE, description = "iam更新项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO update(ProjectDTO projectDTO) {
        ProjectDO project = ConvertHelper.convert(projectDTO, ProjectDO.class);
        if (devopsMessage) {
            ProjectDTO dto = new ProjectDTO();
            CustomUserDetails details = DetailsHelper.getUserDetails();
            UserE user = userRepository.selectByLoginName(details.getUsername());
            ProjectDO projectDO = projectRepository.selectByPrimaryKey(projectDTO.getId());
            OrganizationDO organizationDO = organizationRepository.selectByPrimaryKey(projectDO.getOrganizationId());
            ProjectEventPayload projectEventMsg = new ProjectEventPayload();
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(user.getId());
            if (organizationDO != null) {
                projectEventMsg.setOrganizationCode(organizationDO.getCode());
                projectEventMsg.setOrganizationName(organizationDO.getName());
            }
            projectEventMsg.setProjectId(projectDO.getId());
            projectEventMsg.setProjectCode(projectDO.getCode());
            ProjectE projectE = projectRepository.updateSelective(project);
            projectEventMsg.setProjectName(project.getName());
            BeanUtils.copyProperties(projectE, dto);
            try {
                String input = mapper.writeValueAsString(projectEventMsg);
                sagaClient.startSaga(PROJECT_UPDATE, new StartInstanceDTO(input, "project", "" + projectDO.getId(),ResourceLevel.PROJECT.value(),projectDTO.getId()));
            } catch (Exception e) {
                throw new CommonException("error.projectService.update.event", e);
            }
            return dto;
        } else {
            return ConvertHelper.convert(
                    projectRepository.updateSelective(project), ProjectDTO.class);
        }
    }

    @Override
    @Transactional
    @Saga(code = PROJECT_DISABLE, description = "iam停用项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO disableProject(Long id) {
        ProjectDO project = projectRepository.selectByPrimaryKey(id);
        project.setEnabled(false);
        ProjectE projectE = disableAndSendEvent(project);
        return ConvertHelper.convert(projectE, ProjectDTO.class);
    }

    private ProjectE disableAndSendEvent(ProjectDO project) {
        ProjectE projectE;
        if (devopsMessage) {
            projectE = new ProjectE();
            ProjectEventPayload payload = new ProjectEventPayload();
            payload.setProjectId(project.getId());
            BeanUtils.copyProperties(projectRepository.updateSelective(project), projectE);
            try {
                String input = mapper.writeValueAsString(payload);
                sagaClient.startSaga(PROJECT_DISABLE, new StartInstanceDTO(input, "project", "" + payload.getProjectId(),ResourceLevel.PROJECT.value(),project.getId()));
            } catch (Exception e) {
                throw new CommonException("error.projectService.disableProject.event", e);
            }
        } else {
            projectE = projectRepository.updateSelective(project);
        }
        return projectE;
    }

    @Override
    public List<Long> listUserIds(Long projectId) {
        return projectRepository.listUserIds(projectId);
    }

    @Override
    public List<ProjectDTO> queryByIds(Set<Long> ids) {
        if (ids.isEmpty()) {
            return new ArrayList<>();
        } else {
            return projectRepository.queryByIds(ids);
        }
    }
}
