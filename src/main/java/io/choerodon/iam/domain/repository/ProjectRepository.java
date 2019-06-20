package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.ProjectDTO;

import java.util.List;
import java.util.Set;

/**
 * @author flyleft
 */
public interface ProjectRepository {

    ProjectDTO create(ProjectDTO projectDTO);

    ProjectDTO selectByPrimaryKey(Long projectId);

    List<ProjectDTO> query(ProjectDTO projectDTO);

    PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param, Boolean categoryEnable);

    PageInfo<ProjectDTO> pagingQueryByUserId(Long userId, ProjectDTO projectDTO, int page, int size, String param);

    ProjectDTO updateSelective(ProjectDTO projectDTO);

    List<ProjectDTO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDTO projectDTO);

    List<ProjectDTO> selectAll();

    ProjectDTO selectOne(ProjectDTO projectDTO);

    /**
     * 查找用户在某个组织下所有的项目
     */
    List<ProjectDTO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled);

    List<ProjectDTO> selectByOrgId(Long organizationId);

    PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(int page, int size, Long id, String params);

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
    List<ProjectDTO> selectProjsNotGroup(Long orgId);

    /**
     * 获取组织下不是项目群的且无所属的项目
     *
     * @param orgId 组织Id
     * @return 组织下不是项目群的且无所属的项目列表
     */
    List<ProjectDTO> selectProjsNotInAnyGroup(Long orgId);

    /**
     * 根据项目Id查询当前项目生效的普通项目群信息.
     *
     * @param orgId     组织Id
     * @param projectId 项目Id
     * @return 普通项目群信息
     */
    ProjectDTO selectGroupInfoByEnableProject(Long orgId, Long projectId);

    ProjectDTO selectCategoryByPrimaryKey(Long parentId);

    /**
     * 根据id查询项目及项目的项目类别
     *
     * @param projectId
     * @return
     */
    ProjectDTO selectByPrimaryKeyWithCategory(Long projectId);
}
