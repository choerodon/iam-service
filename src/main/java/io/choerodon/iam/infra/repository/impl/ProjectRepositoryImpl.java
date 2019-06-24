package io.choerodon.iam.infra.repository.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectCategoryDTO;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.common.utils.PageUtils;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.ProjectMapCategoryDTO;
import io.choerodon.iam.infra.dto.ProjectTypeDTO;
import io.choerodon.iam.infra.enums.ProjectCategory;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectCategoryMapper;
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.ProjectTypeMapper;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static io.choerodon.iam.app.service.impl.OrganizationProjectServiceImpl.PROJECT_DEFAULT_CATEGORY;

/**
 * @author flyleft
 */
@Repository
public class ProjectRepositoryImpl implements ProjectRepository {
    @Value("${choerodon.category.enabled:false}")
    private Boolean categoryEnable;

    private ProjectMapper projectMapper;

    private OrganizationMapper organizationMapper;

    private MemberRoleMapper memberRoleMapper;

    private ProjectTypeMapper projectTypeMapper;

    private ProjectMapCategoryMapper projectMapCategoryMapper;

    private ProjectCategoryMapper projectCategoryMapper;

    public ProjectRepositoryImpl(ProjectMapper projectMapper,
                                 OrganizationMapper organizationMapper,
                                 MemberRoleMapper memberRoleMapper,
                                 ProjectTypeMapper projectTypeMapper,
                                 ProjectMapCategoryMapper projectMapCategoryMapper,
                                 ProjectCategoryMapper projectCategoryMapper) {
        this.projectMapper = projectMapper;
        this.organizationMapper = organizationMapper;
        this.memberRoleMapper = memberRoleMapper;
        this.projectTypeMapper = projectTypeMapper;
        this.projectMapCategoryMapper = projectMapCategoryMapper;
        this.projectCategoryMapper = projectCategoryMapper;
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
        return projectMapper.fulltextSearch(projectDTO, null, null, null);
    }

    @Override
    public PageInfo<ProjectDTO> pagingQuery(ProjectDTO projectDTO, int page, int size, String param, Boolean categoryEnable) {
        Page<ProjectDTO> result = new Page<>(page, size);
        if (size == 0) {
            List<ProjectDTO> projectList = new ArrayList<>();
            if (!categoryEnable) {
                projectList = projectMapper.fulltextSearch(projectDTO, param, null, null);
            } else {
                projectList = projectMapper.fulltextSearchCategory(projectDTO, param, null, null);
            }
            result.setTotal(projectList.size());
            result.addAll(projectList);
        } else {
            int start = PageUtils.getBegin(page, size);
            int count = projectMapper.fulltextSearchCount(projectDTO, param);
            result.setTotal(count);
            List<ProjectDTO> projectList = new ArrayList<>();
            if (!categoryEnable) {
                projectList = projectMapper.fulltextSearch(projectDTO, param, start, size);
            } else {
                projectList = projectMapper.fulltextSearchCategory(projectDTO, param, start, size);
            }
            result.addAll(projectList);
        }
        return result.toPageInfo();
    }

    @Override
    public List<ProjectDTO> getAgileProjects(Long organizationId, String param, Boolean categoryEnable) {
        List<ProjectDTO> projectDTOS = new ArrayList<>();
        if (categoryEnable) {
            projectDTOS = projectMapper.selectByOrgIdAndCategoryEnable(organizationId, "AGILE", param);
        } else {
            projectDTOS = projectMapper.selectByOrgIdAndCategory(organizationId, "AGILE", param);
        }
        return projectDTOS;
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
        Page<ProjectDTO> result = new Page<>(page, size);
        if (size == 0) {
            List<ProjectDTO> projectList = projectMapper.selectProjectsWithRoles(id, null, null, params);
            result.setTotal(projectList.size());
            result.addAll(projectList);
        } else {
            int start = PageUtils.getBegin(page, size);
            int count = memberRoleMapper.selectCountBySourceId(id, "project");
            result.setTotal(count);
            List<ProjectDTO> projectList = projectMapper.selectProjectsWithRoles(id, start, size, params);
            result.addAll(projectList);
        }
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
    public List<ProjectDTO> selectProjsNotGroup(Long orgId,Long projectId) {
        return projectMapper.selectProjsNotGroup(orgId,projectId);
    }

    @Override
    public List<ProjectDTO> selectProjsNotInAnyGroup(Long orgId) {
        return projectMapper.selectProjsNotInAnyGroup(orgId);
    }

    @Override
    public ProjectDTO selectGroupInfoByEnableProject(Long orgId, Long projectId) {
        return projectMapper.selectGroupInfoByEnableProject(orgId, projectId);
    }

    @Override
    public ProjectDTO selectCategoryByPrimaryKey(Long projectId) {
        List<ProjectDTO> projectDTOS = projectMapper.selectCategoryByPrimaryKey(projectId);
        ProjectDTO projectDTO = mergeCategories(projectDTOS);
        if (projectDTO == null) {
            throw new CommonException("error.project.not.exist");
        }
        return projectDTO;
    }

    private ProjectDTO mergeCategories(List<ProjectDTO> projectDTOS) {
        if (CollectionUtils.isEmpty(projectDTOS)) {
            return null;
        }
        ProjectDTO projectDTO = new ProjectDTO();
        BeanUtils.copyProperties(projectDTOS.get(0), projectDTO);
        List<String> categories = new ArrayList<>();
        String category = null;
        for (int i = 0; i < projectDTOS.size(); i++) {
            ProjectDTO p = projectDTOS.get(i);
            categories.add(p.getCategory());
            if (category == null && ProjectCategory.PROGRAM.value().equalsIgnoreCase(p.getCategory())) {
                category = ProjectCategory.PROGRAM.value();
            } else if (category == null && ProjectCategory.AGILE.value().equalsIgnoreCase(p.getCategory())) {
                category = ProjectCategory.AGILE.value();
            } else if (category == null) {
                category = p.getCategory();
            }
        }
        projectDTO.setCategory(category);
        projectDTO.setCategories(categories);
        return projectDTO;
    }

    @Override
    public ProjectDTO selectByPrimaryKeyWithCategory(Long projectId) {
        ProjectDTO projectDTO = projectMapper.selectByPrimaryKey(projectId);
        projectDTO.setCategories(projectMapCategoryMapper.selectProjectCategoryNames(projectDTO.getId()));
        return projectDTO;
    }

    @Override
    public ProjectMapCategoryDTO assignDefaultCategoriesToProjects(Long projectId) {
        ProjectMapCategoryDTO projectMapCategoryDTO = new ProjectMapCategoryDTO();

        ProjectCategoryDTO projectCategoryDTO = new ProjectCategoryDTO();
        projectCategoryDTO.setCode(PROJECT_DEFAULT_CATEGORY);
        projectCategoryDTO = projectCategoryMapper.selectOne(projectCategoryDTO);
        if (projectCategoryDTO != null) {
            projectMapCategoryDTO.setCategoryId(projectCategoryDTO.getId());
        }
        projectMapCategoryDTO.setProjectId(projectId);

        if (projectMapCategoryMapper.insert(projectMapCategoryDTO) != 1) {
            throw new CommonException("error.project.map.category.insert");
        }
        return projectMapCategoryDTO;
    }

    @Override
    public List<ProjectDTO> selectByOrgIdAndCategory(Long organizationId, String agile) {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setOrganizationId(organizationId);
        projectDTO.setCategory(agile);
        return projectMapper.select(projectDTO);
    }
}
