package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;
import java.util.Set;

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
     */
    List<ProjectDO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled);

    List<ProjectDO> selectByOrgId(Long organizationId);

    Page<ProjectDO> pagingQueryProjectAndRolesById(PageRequest pageRequest, Long id, String params);

    List<Long> listUserIds(Long id);

    List<ProjectDTO> queryByIds(Set<Long> ids);


    /**
     * 获取组织下指定项目类型Code下的项目名
     */
    List<String> selectProjectNameByTypeCode(String typeCode, Long orgId);

    /**
     * 获取组织下没有项目类型的项目名
     */
    List<String> selectProjectNameNoType(Long orgId);

    /**
     * 获取组织下不是项目群的项目
     * @param orgId
     * @return
     */
    List<ProjectDTO> selectProjsNotGroup(Long orgId);

}
