package io.choerodon.iam.infra.repository.impl;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.ProjectTypeDTO;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.ProjectTypeMapper;

/**
 * @author flyleft
 */
@Repository
public class ProjectRepositoryImpl implements ProjectRepository {

    private ProjectMapper projectMapper;

    private OrganizationMapper organizationMapper;

    private MemberRoleMapper memberRoleMapper;

    private ProjectTypeMapper projectTypeMapper;

    public ProjectRepositoryImpl(ProjectMapper projectMapper,
                                 OrganizationMapper organizationMapper,
                                 MemberRoleMapper memberRoleMapper,
                                 ProjectTypeMapper projectTypeMapper) {
        this.projectMapper = projectMapper;
        this.organizationMapper = organizationMapper;
        this.memberRoleMapper = memberRoleMapper;
        this.projectTypeMapper = projectTypeMapper;
    }

    @Override
    public ProjectDTO create(ProjectDTO projectDTO) {
        if (!organizationMapper.existsWithPrimaryKey(projectDTO.getOrganizationId())) {
            throw new CommonException("error.organization.notFound");
        }
        ProjectDTO project = new ProjectDTO();
        project.setCode(projectDTO.getCode());
        project.setOrganizationId(projectDTO.getOrganizationId());
        if (projectMapper.selectOne(project) != null) {
            throw new CommonException("error.project.code.duplicated");
        }
        if (projectMapper.insertSelective(projectDTO) != 1) {
            throw new CommonException("error.project.create");
        }
        ProjectTypeDTO projectTypeDTO = new ProjectTypeDTO();
        projectTypeDTO.setCode(projectDTO.getType());
        if (projectDTO.getType() != null && projectTypeMapper.selectCount(projectTypeDTO) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        return projectMapper.selectByPrimaryKey(projectDTO);
    }

    @Override
    public ProjectDTO selectByPrimaryKey(Long projectId) {
        ProjectDTO projectDTO = projectMapper.selectByPrimaryKey(projectId);
        if (projectDTO == null) {
            throw new CommonException("error.project.not.exist");
        }
        return projectDTO;
    }

    @Override
    public List<ProjectDTO> query(ProjectDTO projectDTO) {
        return projectMapper.fulltextSearch(projectDTO, null);
    }

    @Override
    public PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> projectMapper.fulltextSearch(projectDTO, param));
    }

    @Override
    public PageInfo<ProjectDTO> pagingQueryByUserId(Long userId, ProjectDTO projectDTO, int page, int size, String param) {
        return PageHelper.startPage(page, size).doSelectPageInfo(() -> projectMapper.selectProjectsByUserIdWithParam(userId, projectDTO, param));
    }

    @Override
    public ProjectDTO updateSelective(ProjectDTO projectDTO) {
        ProjectDTO project = projectMapper.selectByPrimaryKey(projectDTO.getId());
        if (project == null) {
            throw new CommonException("error.project.not.exist");
        }
        ProjectTypeDTO projectTypeDTO = new ProjectTypeDTO();
        projectTypeDTO.setCode(projectDTO.getType());
        if (projectDTO.getType() != null && projectTypeMapper.selectCount(projectTypeDTO) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        if (!StringUtils.isEmpty(projectDTO.getName())) {
            project.setName(projectDTO.getName());
        }
        if (!StringUtils.isEmpty(projectDTO.getCode())) {
            project.setCode(projectDTO.getCode());
        }
        if (projectDTO.getEnabled() != null) {
            project.setEnabled(projectDTO.getEnabled());
        }
        if (projectDTO.getImageUrl() != null) {
            project.setImageUrl(projectDTO.getImageUrl());
        }
        project.setType(projectDTO.getType());
        if (projectMapper.updateByPrimaryKey(project) != 1) {
            throw new CommonException("error.project.update");
        }
        ProjectDTO returnProject = projectMapper.selectByPrimaryKey(projectDTO.getId());
        if (returnProject.getType() != null) {
            ProjectTypeDTO dto = new ProjectTypeDTO();
            dto.setCode(project.getType());
            returnProject.setTypeName(projectTypeMapper.selectOne(dto).getName());
        }
        return returnProject;
    }


    @Override
    public List<ProjectDTO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDTO projectDTO) {
        return projectMapper.selectProjectsByUserId(userId, projectDTO);
    }

    @Override
    public List<ProjectDTO> selectAll() {
        return projectMapper.selectAllWithProjectType();
    }

    @Override
    public ProjectDTO selectOne(ProjectDTO projectDTO) {
        return projectMapper.selectOne(projectDTO);
    }

    @Override
    public List<ProjectDTO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled) {
        return projectMapper.selectUserProjectsUnderOrg(userId, orgId, isEnabled);
    }

    @Override
    public List<ProjectDTO> selectByOrgId(Long organizationId) {
        ProjectDTO dto = new ProjectDTO();
        dto.setOrganizationId(organizationId);
        return projectMapper.select(dto);
    }


    @Override
    public PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(int page, int size, Long id, String params) {
        int start = page * size;
        int count = memberRoleMapper.selectCountBySourceId(id, "project");
        Page<ProjectDTO> result = new Page<>(page, size, true);
        result.setTotal(count);
        List<ProjectDTO> projectList = projectMapper.selectProjectsWithRoles(id, start, size, params);
        result.addAll(projectList);
        return result.toPageInfo();
    }

    @Override
    public List<Long> listUserIds(Long id) {
        return projectMapper.listUserIds(id);

    }

    @Override
    public List<ProjectDTO> queryByIds(Set<Long> ids) {
        return projectMapper.selectByIds(ids);
    }

    @Override
    public List<String> selectProjectNameByTypeCode(String typeCode, Long orgId) {
        return projectMapper.selectProjectNameByType(typeCode, orgId);
    }

    @Override
    public List<String> selectProjectNameNoType(Long orgId) {
        return projectMapper.selectProjectNameNoType(orgId);
    }

    @Override
    public List<ProjectDTO> selectProjsNotGroup(Long orgId) {
        return projectMapper.selectProjsNotGroup(orgId);
    }

    @Override
    public List<ProjectDTO> selectProjsNotInAnyGroup(Long orgId) {
        return projectMapper.selectProjsNotInAnyGroup(orgId);
    }

    @Override
    public ProjectDTO selectGroupInfoByEnableProject(Long orgId, Long projectId) {
        return projectMapper.selectGroupInfoByEnableProject(orgId, projectId);
    }
}
