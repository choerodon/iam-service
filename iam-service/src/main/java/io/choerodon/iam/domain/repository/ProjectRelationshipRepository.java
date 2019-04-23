package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;

import java.util.List;


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
    ProjectRelationshipDTO addProjToGroup(ProjectRelationshipDTO projectRelationshipDTO);

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
    ProjectRelationshipDTO selectByPrimaryKey(Long id);

    /**
     * 更新项目群
     *
     * @param projectRelationshipDO
     * @return
     */
    ProjectRelationshipDTO update(ProjectRelationshipDTO projectRelationshipDTO);

    /**
     * selectOne
     *
     * @param projectRelationshipDO
     * @return
     */
    ProjectRelationshipDTO selectOne(ProjectRelationshipDTO projectRelationshipDTO);

    /**
     * select
     * @param projectRelationshipDO
     * @return
     */
    List<ProjectRelationshipDTO> select(ProjectRelationshipDTO projectRelationshipDTO);
}
