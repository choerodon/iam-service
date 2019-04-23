package io.choerodon.iam.domain.repository;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.ProjectDTO;

/**
 * @author flyleft
 */
public interface ProjectRepository {

    ProjectDTO create(ProjectDTO projectDTO);

    ProjectDTO selectByPrimaryKey(Long projectId);

    List<ProjectDTO> query(ProjectDTO projectDTO);

    Page<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param);

    Page<ProjectDTO> pagingQueryByUserId(Long userId, ProjectDTO projectDTO, int page,int size, String param);

    ProjectDTO updateSelective(ProjectDTO projectDTO);

    List<ProjectDTO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDTO projectDTO);

    List<ProjectDTO> selectAll();

    ProjectDTO selectOne(ProjectDTO projectDTO);

    /**
     * 查找用户在某个组织下所有的项目
     */
    List<ProjectDTO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled);

    List<ProjectDTO> selectByOrgId(Long organizationId);

    Page<ProjectDTO> pagingQueryProjectAndRolesById(int page,int size, Long id, String params);

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

    /**
     * 获取组织下不是项目群且无所属的项目
     * @param orgId
     * @return
     */
    List<ProjectDTO> selectProjsNotInAnyGroup(Long orgId);
}
