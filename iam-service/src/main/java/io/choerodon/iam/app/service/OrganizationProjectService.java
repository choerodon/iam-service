package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.ProjectDTO;

/**
 * @author flyleft
 */
public interface OrganizationProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);

    List<ProjectDTO> queryAll(ProjectDTO projectDTO);

    Page<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param);

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

    /**
     * 查询组织下可被分配至当前项目群的敏捷项目
     *
     * @param organizationId
     * @param projectId
     * @return 项目列表
     */
    List<ProjectDTO> getAvailableAgileProj(Long organizationId,Long projectId);
}
