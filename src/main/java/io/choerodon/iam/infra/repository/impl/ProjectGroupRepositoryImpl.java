package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectGroupDTO;
import io.choerodon.iam.domain.repository.ProjectGroupRepository;
import io.choerodon.iam.infra.dataobject.ProjectGroupDO;
import io.choerodon.iam.infra.mapper.ProjectGroupMapper;

/**
 * @author Eugen
 */
@Component
public class ProjectGroupRepositoryImpl implements ProjectGroupRepository {
    ProjectGroupMapper projectGroupMapper;

    public ProjectGroupRepositoryImpl(ProjectGroupMapper projectGroupMapper) {
        this.projectGroupMapper = projectGroupMapper;
    }

    @Override
    public List<ProjectGroupDTO> seleteProjectsByParentId(Long parentId) {
        return projectGroupMapper.seleteProjectsByParentId(parentId);
    }

    @Override
    public ProjectGroupDO addProjToGroup(ProjectGroupDTO projectGroupDTO) {
        ProjectGroupDO projectGroupDO = new ProjectGroupDO();
        BeanUtils.copyProperties(projectGroupDTO, projectGroupDO);
        if (projectGroupMapper.insertSelective(projectGroupDO) != 1) {
            throw new CommonException("error.create.project.group");
        }
        return projectGroupDO;
    }

    @Override
    public void deleteGroup(long groupId) {
        if (projectGroupMapper.selectByPrimaryKey(groupId) == null) {
            throw new CommonException("error.delete.project.group.not.exist");
        }
        if (projectGroupMapper.deleteByPrimaryKey(groupId) != 1) {
            throw new CommonException("error.delete.project.group");
        }
    }

    @Override
    public ProjectGroupDO selectByPrimaryKey(Long id) {
        return projectGroupMapper.selectByPrimaryKey(id);
    }

    @Override
    public ProjectGroupDO update(ProjectGroupDO projectGroupDO) {
        if (projectGroupMapper.updateByPrimaryKeySelective(projectGroupDO) != 1) {
            throw new CommonException("error.project.group.update");
        }
        return projectGroupMapper.selectByPrimaryKey(projectGroupDO.getId());
    }

    @Override
    public ProjectGroupDO selectOne(ProjectGroupDO projectGroupDO) {
        return projectGroupMapper.selectOne(projectGroupDO);
    }
}
