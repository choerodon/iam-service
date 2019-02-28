package io.choerodon.iam.app.service;

import java.util.List;

import io.choerodon.iam.api.dto.ProjectGroupDTO;

/**
 * @author Eugen
 */
public interface ProjectGroupService {

    /**
     * 查询项目群下的所有项目
     *
     * @param projectId 项目Id
     * @return
     */
    List<ProjectGroupDTO> getProjUnderGroup(Long projectId);

    /**
     * 项目组下移除项目
     *
     * @param groupId
     */
    void removesAProjUnderGroup(Long groupId);

    /**
     * 项目组下批量添加项目
     *
     * @param list
     * @return list
     */
    List<ProjectGroupDTO> batchAddProjsToTheGroup(List<ProjectGroupDTO> list);


    /**
     * 项目组下批量更新项目
     *
     * @param list
     * @return list
     */
    List<ProjectGroupDTO> batchModifyProjsToTheGroup(List<ProjectGroupDTO> list);

    /**
     * 修改项目组的关联时间（包括开始及结束时间）
     */
    ProjectGroupDTO updateGroupDate(ProjectGroupDTO projectGroupDTO);

    /**
     * 批量修改/新增/启停用项目组
     *
     * @param list
     * @return
     */
    List<ProjectGroupDTO> batchUpdateProjsToTheGroup(List<ProjectGroupDTO> list);

}
