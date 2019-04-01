package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;

/**
 * @author Eugen
 */
public interface ProjectRelationshipRepository {
    /**
     * 查询一个项目群下的所有项目(groupid,id,code,name)
     *
     * @param parentId
     * @return 项目list
     */
    List<ProjectRelationshipDTO> seleteProjectsByParentId(Long parentId);

    /**
     * 项目群下添加项目
     *
     * @param projectRelationshipDTO 项目组
     * @return
     */
    ProjectRelationshipDO addProjToGroup(ProjectRelationshipDTO projectRelationshipDTO);

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
    ProjectRelationshipDO selectByPrimaryKey(Long id);

    /**
     * 更新项目群
     *
     * @param projectRelationshipDO
     * @return
     */
    ProjectRelationshipDO update(ProjectRelationshipDO projectRelationshipDO);

    /**
     * selectOne
     *
     * @param projectRelationshipDO
     * @return
     */
    ProjectRelationshipDO selectOne(ProjectRelationshipDO projectRelationshipDO);

    /**
     * select
     * @param projectRelationshipDO
     * @return
     */
    List<ProjectRelationshipDO> select(ProjectRelationshipDO projectRelationshipDO);
}
