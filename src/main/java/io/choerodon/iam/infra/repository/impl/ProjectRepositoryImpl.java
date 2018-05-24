package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.mapper.OrganizationMapper;
import io.choerodon.iam.infra.mapper.ProjectMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 * @date 2018/3/26
 */
@Repository
public class ProjectRepositoryImpl implements ProjectRepository {

    private ProjectMapper projectMapper;

    private OrganizationMapper organizationMapper;


    public ProjectRepositoryImpl(ProjectMapper projectMapper, OrganizationMapper organizationMapper) {
        this.projectMapper = projectMapper;
        this.organizationMapper = organizationMapper;
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
    public Page<ProjectDO> pagingQuery(ProjectDO projectDO, PageRequest pageRequest, String[] params) {
        return PageHelper.doPageAndSort(pageRequest, () -> projectMapper.fulltextSearch(projectDO, params));
    }

    @Override
    public Page<ProjectDO> pagingSelectFromMemberRoleByOption(Long userId, PageRequest pageRequest, ProjectDO projectDO) {
        return PageHelper.doPageAndSort(pageRequest, () ->
                projectMapper.selectProjectsFromMemberRoleByOption(userId, projectDO));
    }

    @Override
    public ProjectE updateSelective(ProjectDO projectDO) {
        ProjectDO project = projectMapper.selectByPrimaryKey(projectDO.getId());
        if (project == null) {
            throw new CommonException("error.project.not.exist");
        }
        if (projectMapper.updateByPrimaryKeySelective(projectDO) != 1) {
            throw new CommonException("error.project.update");
        }
        return ConvertHelper.convert(projectMapper.selectByPrimaryKey(projectDO.getId()), ProjectE.class);
    }

    @Override
    public List<ProjectDO> selectFromMemberRoleByOptionWithoutPaging(Long userId, Long organizationId) {
        ProjectDO projectDO = new ProjectDO();
        projectDO.setOrganizationId(organizationId);
        return projectMapper.selectProjectsFromMemberRoleByOption(userId, projectDO);
    }

    @Override
    public List<ProjectDO> selectByOptions(ProjectDO projectDO) {
        return projectMapper.select(projectDO);
    }

    @Override
    public List<ProjectDO> selectProjectsFromMemberRoleByOptions(Long userId, ProjectDO projectDO) {
        return projectMapper.selectProjectsFromMemberRoleByOption(userId, projectDO);
    }

    @Override
    public List<ProjectDO> selectAll() {
        return projectMapper.selectAll();
    }

    @Override
    public ProjectDO selectOne(ProjectDO projectDO) {
        return projectMapper.selectOne(projectDO);
    }
}
