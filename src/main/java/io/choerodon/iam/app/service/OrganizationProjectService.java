package io.choerodon.iam.app.service;

import java.util.List;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 * @date 2018/3/26
 */
public interface OrganizationProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);

    List<ProjectDTO> queryAll(ProjectDTO projectDTO);

    Page<ProjectDTO> pagingQuery(ProjectDTO projectDTO, PageRequest pageRequest, String[] params);

    ProjectDTO update(Long organizationId, ProjectDTO projectDTO);

    ProjectDTO enableProject(Long organizationId, Long projectId);

    ProjectDTO disableProject(Long organizationId, Long projectId);

    void check(ProjectDTO projectDTO);
}
