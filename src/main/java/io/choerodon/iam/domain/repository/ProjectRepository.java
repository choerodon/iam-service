package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 */
public interface ProjectRepository {

    ProjectE create(ProjectE projectE);

    ProjectDO selectByPrimaryKey(Long projectId);

    List<ProjectDO> query(ProjectDO projectDO);

    Page<ProjectDO> pagingQuery(ProjectDO projectDO, PageRequest pageRequest, String param);

    Page<ProjectDO> pagingQueryByUserId(Long userId, ProjectDO projectDO, PageRequest pageRequest, String param);

    ProjectE updateSelective(ProjectDO projectDO);

    List<ProjectDO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDO projectDO);

    List<ProjectDO> selectAll();

    ProjectDO selectOne(ProjectDO projectDO);

    /**
     * 查找用户在某个组织下所有的项目
     *
     * @param isEnabled
     */
    List<ProjectDO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled);

    List<ProjectDO> selectByOrgId(Long organizationId);

    Page<ProjectDO> pagingQueryProjectAndRolesById(PageRequest pageRequest, Long id, String params);

    List<Long> listUserIds(Long id);
}
