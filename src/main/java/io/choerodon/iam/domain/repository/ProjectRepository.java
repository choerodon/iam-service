package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author flyleft
 * @date 2018/3/26
 */
public interface ProjectRepository {

    ProjectE create(ProjectE projectE);

    ProjectDO selectByPrimaryKey(Long projectId);

    List<ProjectDO> query(ProjectDO projectDO);

    Page<ProjectDO> pagingQuery(ProjectDO projectDO, PageRequest pageRequest, String[] params);

    Page<ProjectDO> pagingSelectFromMemberRoleByOption(Long userId, PageRequest pageRequest, ProjectDO projectDO);

    ProjectE updateSelective(ProjectDO projectDO);

    List<ProjectDO> selectFromMemberRoleByOptionWithoutPaging(Long userId, Long id);

    List<ProjectDO> selectByOptions(ProjectDO projectDO);

    List<ProjectDO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDO projectDO);

    List<ProjectDO> selectAll();

    ProjectDO selectOne(ProjectDO projectDO);
}
