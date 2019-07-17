package io.choerodon.iam.app.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;
import io.choerodon.iam.api.dto.payload.ProjectEventPayload;
import io.choerodon.iam.app.service.OrganizationProjectService;
import io.choerodon.iam.app.service.ProjectService;
import io.choerodon.iam.infra.asserts.DetailsHelperAssert;
import io.choerodon.iam.infra.asserts.ProjectAssertHelper;
import io.choerodon.iam.infra.asserts.UserAssertHelper;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.UserMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static io.choerodon.iam.infra.common.utils.SagaTopic.Project.PROJECT_UPDATE;
import static io.choerodon.iam.infra.asserts.UserAssertHelper.WhichColumn;

/**
 * @author flyleft
 */
@Service
@RefreshScope
public class ProjectServiceImpl implements ProjectService {

    private OrganizationProjectService organizationProjectService;

    @Value("${choerodon.category.enabled:false}")
    private boolean enableCategory;

    @Value("${choerodon.devops.message:false}")
    private boolean devopsMessage;

    @Value("${spring.application.name:default}")
    private String serviceName;

    private SagaClient sagaClient;

    private final ObjectMapper mapper = new ObjectMapper();

    private UserMapper userMapper;

    private ProjectMapper projectMapper;
    private ProjectAssertHelper projectAssertHelper;
    private ProjectMapCategoryMapper projectMapCategoryMapper;
    private UserAssertHelper userAssertHelper;
    private OrganizationMapper organizationMapper;

    public ProjectServiceImpl(OrganizationProjectService organizationProjectService,
                              SagaClient sagaClient,
                              UserMapper userMapper,
                              ProjectMapper projectMapper,
                              ProjectAssertHelper projectAssertHelper,
                              ProjectMapCategoryMapper projectMapCategoryMapper,
                              UserAssertHelper userAssertHelper,
                              OrganizationMapper organizationMapper) {
        this.organizationProjectService = organizationProjectService;
        this.sagaClient = sagaClient;
        this.userMapper = userMapper;
        this.projectMapper = projectMapper;
        this.projectAssertHelper = projectAssertHelper;
        this.projectMapCategoryMapper = projectMapCategoryMapper;
        this.userAssertHelper = userAssertHelper;
        this.organizationMapper = organizationMapper;
    }

    @Override
    public ProjectDTO queryProjectById(Long projectId) {
        ProjectDTO dto = projectAssertHelper.projectNotExisted(projectId);
        if (enableCategory) {
            dto.setCategories(projectMapCategoryMapper.selectProjectCategoryNames(dto.getId()));
        }
        return dto;
    }

    @Override
    public PageInfo<UserDTO> pagingQueryTheUsersOfProject(Long id, Long userId, String email, PageRequest pageRequest, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> userMapper.selectUsersByLevelAndOptions(ResourceLevel.PROJECT.value(), id, userId, email, param));
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    @Saga(code = PROJECT_UPDATE, description = "iam更新项目", inputSchemaClass = ProjectEventPayload.class)
    public ProjectDTO update(ProjectDTO projectDTO) {
        if (devopsMessage) {
            ProjectDTO dto = new ProjectDTO();
            CustomUserDetails details = DetailsHelperAssert.userDetailNotExisted();
            UserDTO user = userAssertHelper.userNotExisted(WhichColumn.LOGIN_NAME, details.getUsername());
            ProjectDTO newProject = projectAssertHelper.projectNotExisted(projectDTO.getId());

            OrganizationDTO organizationDTO = organizationMapper.selectByPrimaryKey(newProject.getOrganizationId());
            ProjectEventPayload projectEventMsg = new ProjectEventPayload();
            projectEventMsg.setUserName(details.getUsername());
            projectEventMsg.setUserId(user.getId());
            if (organizationDTO != null) {
                projectEventMsg.setOrganizationCode(organizationDTO.getCode());
                projectEventMsg.setOrganizationName(organizationDTO.getName());
            }
            projectEventMsg.setProjectId(newProject.getId());
            projectEventMsg.setProjectCode(newProject.getCode());
            ProjectDTO newDTO = organizationProjectService.updateSelective(projectDTO);
            projectEventMsg.setProjectName(projectDTO.getName());
            projectEventMsg.setImageUrl(newDTO.getImageUrl());
            BeanUtils.copyProperties(newDTO, dto);
            try {
                String input = mapper.writeValueAsString(projectEventMsg);
                sagaClient.startSaga(PROJECT_UPDATE, new StartInstanceDTO(input, "project", "" + newProject.getId(), ResourceLevel.PROJECT.value(), projectDTO.getId()));
            } catch (Exception e) {
                throw new CommonException("error.projectService.update.event", e);
            }
            return dto;
        } else {
            return organizationProjectService.updateSelective(projectDTO);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProjectDTO disableProject(Long projectId) {
        Long userId = DetailsHelper.getUserDetails().getUserId();
        return organizationProjectService.disableProject(null, projectId, userId);
    }

    @Override
    public List<Long> listUserIds(Long projectId) {
        return projectMapper.listUserIds(projectId);
    }

    @Override
    public List<ProjectDTO> queryByIds(Set<Long> ids) {
        if (ids.isEmpty()) {
            return new ArrayList<>();
        } else {
            return projectMapper.selectByIds(ids);
        }
    }

    @Override
    public Boolean checkProjCode(String code) {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setCode(code);
        return projectMapper.selectOne(projectDTO) == null;
    }
}
