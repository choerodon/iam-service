package io.choerodon.iam.app.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.event.producer.execute.EventProducerTemplate;
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

import static io.choerodon.iam.api.dto.payload.ProjectEventPayload.EVENT_TYPE_UPDATE_PROJECT;

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

    private EventProducerTemplate eventProducerTemplate;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository,
                              OrganizationRepository organizationRepository,
                              EventProducerTemplate eventProducerTemplate) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.eventProducerTemplate = eventProducerTemplate;
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
            Exception exception = eventProducerTemplate.execute("project", EVENT_TYPE_UPDATE_PROJECT,
                    serviceName, projectEventMsg, (String uuid) -> {
                        ProjectE projectE = projectRepository.updateSelective(project);
                        projectEventMsg.setProjectName(project.getName());
                        BeanUtils.copyProperties(projectE, dto);
                    });
            if (exception != null) {
                throw new CommonException(exception.getMessage());
            }
            return dto;
        } else {
            return ConvertHelper.convert(
                    projectRepository.updateSelective(project), ProjectDTO.class);
        }
    }

    @Override
    public ProjectDTO disableProject(Long id) {
        ProjectDO project = projectRepository.selectByPrimaryKey(id);
        project.setEnabled(false);
        return ConvertHelper.convert(projectRepository.updateSelective(project), ProjectDTO.class);
    }
}
