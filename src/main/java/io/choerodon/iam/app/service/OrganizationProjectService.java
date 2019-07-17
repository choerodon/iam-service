package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.ProjectDTO;

import java.util.List;
import java.util.Map;

/**
 * @author flyleft
 */
public interface OrganizationProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);
    ProjectDTO create(ProjectDTO projectDTO);

    List<ProjectDTO> queryAll(ProjectDTO projectDTO);

    PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, PageRequest pageRequest, String param);

    ProjectDTO update(Long organizationId, ProjectDTO projectDTO);

    ProjectDTO updateSelective(ProjectDTO projectDTO);

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
     * @param organizationId 组织Id
     * @param projectId      项目Id
     * @return 项目列表
     */
    List<ProjectDTO> getAvailableAgileProj(Long organizationId, Long projectId);

    ProjectDTO selectCategoryByPrimaryKey(Long projectId);

    /**
     * 查询当前项目生效的普通项目群信息(项目为启用状态且当前时间在其有效期内).
     *
     * @param organizationId 组织Id
     * @param projectId      项目Id
     * @return 普通项目群信息
     */
    ProjectDTO getGroupInfoByEnableProject(Long organizationId, Long projectId);

    List<ProjectDTO> getAgileProjects(Long organizationId, String param);
}
