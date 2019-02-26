package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.iam.api.dto.ProjectGroupDTO;
import io.choerodon.iam.infra.dataobject.ProjectGroupDO;

/**
 * @author Eugen
 */
public interface ProjectGroupRepository {
    /**
     * 查询一个项目群下的所有项目(groupid,id,code,name)
     *
     * @param parentId
     * @return 项目list
     */
    List<ProjectGroupDTO> seleteProjectsByParentId(Long parentId);

    /**
     * 项目群下添加项目
     *
     * @param projectGroupDTO 项目组
     * @return
     */
    ProjectGroupDO addProjToGroup(ProjectGroupDTO projectGroupDTO);

    /**
     * 删除一个group
     *
     * @param groupId groupId
     */
    void deleteGroup(long groupId);

    /**
     * 根据主键查询
     *
     * @param id 主键
     * @return
     */
    ProjectGroupDO selectByPrimaryKey(Long id);

    /**
     * 更新项目群
     * @param projectGroupDO
     * @return
     */
    ProjectGroupDO update(ProjectGroupDO projectGroupDO);

    /**
     * selectOne
     * @param projectGroupDO
     * @return
     */
    ProjectGroupDO selectOne(ProjectGroupDO projectGroupDO);
}
