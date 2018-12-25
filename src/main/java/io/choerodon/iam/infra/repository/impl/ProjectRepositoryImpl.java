package io.choerodon.iam.infra.repository.impl;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.domain.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.ProjectTypeDO;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.iam.infra.mapper.ProjectTypeMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

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
    public ProjectE create(ProjectE projectE) {
        if (!organizationMapper.existsWithPrimaryKey(projectE.getOrganizationId())) {
            throw new CommonException("error.organization.notFound");
        }
        ProjectDO projectDO = ConvertHelper.convert(projectE, ProjectDO.class);
        ProjectDO project = new ProjectDO();
        project.setCode(projectE.getCode());
        project.setOrganizationId(projectE.getOrganizationId());
        if (projectMapper.selectOne(project) != null) {
            throw new CommonException("error.project.code.duplicated");
        }
        if (projectMapper.insertSelective(projectDO) != 1) {
            throw new CommonException("error.project.create");
        }
        if (projectDO.getType() != null && projectTypeMapper.selectCount(new ProjectTypeDO(projectDO.getType())) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        return ConvertHelper.convert(projectMapper.selectByPrimaryKey(projectDO.getId()), ProjectE.class);
    }

    @Override
    public ProjectDO selectByPrimaryKey(Long projectId) {
        ProjectDO projectDO = projectMapper.selectByPrimaryKey(projectId);
        if (projectDO == null) {
            throw new CommonException("error.project.not.exist");
        }
        return projectDO;
    }

    @Override
    public List<ProjectDO> query(ProjectDO projectDO) {
        return projectMapper.fulltextSearch(projectDO, null);
    }

    @Override
    public Page<ProjectDO> pagingQuery(ProjectDO projectDO, PageRequest pageRequest, String param) {
        return PageHelper.doPageAndSort(pageRequest, () -> projectMapper.fulltextSearch(projectDO, param));
    }

    @Override
    public Page<ProjectDO> pagingQueryByUserId(Long userId, ProjectDO projectDO, PageRequest pageRequest, String param) {
        return PageHelper.doPageAndSort(pageRequest, () -> projectMapper.selectProjectsByUserIdWithParam(userId, projectDO, param));
    }

    @Override
    public ProjectE updateSelective(ProjectDO projectDO) {
        ProjectDO project = projectMapper.selectByPrimaryKey(projectDO.getId());
        if (project == null) {
            throw new CommonException("error.project.not.exist");
        }
        if (projectDO.getType() != null && projectTypeMapper.selectCount(new ProjectTypeDO(projectDO.getType())) != 1) {
            throw new CommonException("error.project.type.notExist");
        }
        if (!StringUtils.isEmpty(projectDO.getName())) {
            project.setName(projectDO.getName());
        }
        if (!StringUtils.isEmpty(projectDO.getCode())) {
            project.setCode(projectDO.getCode());
        }
        if (projectDO.getEnabled() != null) {
            project.setEnabled(projectDO.getEnabled());
        }
        project.setType(projectDO.getType());
        if (projectMapper.updateByPrimaryKey(project) != 1) {
            throw new CommonException("error.project.update");
        }
        ProjectDO returnProject = projectMapper.selectByPrimaryKey(projectDO.getId());
        if (returnProject.getType() != null) {
            ProjectTypeDO projectTypeDO = projectTypeMapper.selectOne(new ProjectTypeDO(project.getType()));
            returnProject.setTypeName(projectTypeDO.getName());
        }
        return ConvertHelper.convert(returnProject, ProjectE.class);
    }


    @Override
    public List<ProjectDO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDO projectDO) {
        return projectMapper.selectProjectsByUserId(userId, projectDO);
    }

    @Override
    public List<ProjectDO> selectAll() {
        return projectMapper.selectAllWithProjectType();
    }

    @Override
    public ProjectDO selectOne(ProjectDO projectDO) {
        return projectMapper.selectOne(projectDO);
    }

    @Override
    public List<ProjectDO> selectUserProjectsUnderOrg(Long userId, Long orgId, Boolean isEnabled) {
        return projectMapper.selectUserProjectsUnderOrg(userId, orgId, isEnabled);
    }

    @Override
    public List<ProjectDO> selectByOrgId(Long organizationId) {
        ProjectDO projectDO = new ProjectDO();
        projectDO.setOrganizationId(organizationId);
        return projectMapper.select(projectDO);
    }


    @Override
    public Page<ProjectDO> pagingQueryProjectAndRolesById(PageRequest pageRequest, Long id, String params) {
        int page = pageRequest.getPage();
        int size = pageRequest.getSize();
        int start = page * size;
        PageInfo pageInfo = new PageInfo(page, size);
        int count = memberRoleMapper.selectCountBySourceId(id, "project");
        List<ProjectDO> projectList = projectMapper.selectProjectsWithRoles(id, start, size, params);
        return new Page<>(projectList, pageInfo, count);
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
}
