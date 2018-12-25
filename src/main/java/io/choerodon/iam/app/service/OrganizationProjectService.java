package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 */
public interface OrganizationProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);

    List<ProjectDTO> queryAll(ProjectDTO projectDTO);

    Page<ProjectDTO> pagingQuery(ProjectDTO projectDTO, PageRequest pageRequest, String param);

    ProjectDTO update(Long organizationId, ProjectDTO projectDTO);

    ProjectDTO enableProject(Long organizationId, Long projectId, Long userId);

    ProjectDTO disableProject(Long organizationId, Long projectId, Long userId);

    void check(ProjectDTO projectDTO);


    /**
     * 查询 组织下 各类型下的项目数及项目名
     *
     * @param organizationId 组织Id
     * @return map
     */
    Map<String, Object> getProjectsByType(Long organizationId);
}
