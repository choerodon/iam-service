package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.apache.ibatis.annotations.Param;

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
     *
     * @param orgId 组织Id
     * @return 组织下不是项目群的项目列表
     */
    List<ProjectDTO> selectProjsNotGroup(@Param("orgId") Long orgId);

    /**
     * 获取组织下不是项目群的且无所属的项目
     *
     * @param orgId 组织Id
     * @return 组织下不是项目群的且无所属的项目列表
     */
    List<ProjectDTO> selectProjsNotInAnyGroup(@Param("orgId") Long orgId);

    /**
     * 根据项目Id查询当前项目生效的普通项目群信息.
     *
     * @param orgId     组织Id
     * @param projectId 项目Id
     * @return 普通项目群信息
     */
    ProjectDTO selectGroupInfoByEnableProject(@Param("orgId") Long orgId, @Param("projectId") Long projectId);
}
