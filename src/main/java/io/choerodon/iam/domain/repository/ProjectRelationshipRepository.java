package io.choerodon.iam.domain.repository;

import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;

import java.util.List;

/**
 * @author Eugen
 */
public interface ProjectRelationshipRepository {
    /**
     * 查询一个项目群下的子项目(默认查所有子项目，可传参只查启用的子项目).
     *
     * @param parentId     父级Id
     * @param onlySelectEnable 是否只查启用项目
     * @return 项目群下的子项目列表
     */
    List<ProjectRelationshipDTO> selectProjectsByParentId(Long parentId, Boolean onlySelectEnable);

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
     *
     * @param projectRelationshipDO
     * @return
     */
    List<ProjectRelationshipDO> select(ProjectRelationshipDO projectRelationshipDO);
}
