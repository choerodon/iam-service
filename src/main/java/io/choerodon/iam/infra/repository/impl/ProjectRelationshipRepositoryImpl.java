package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.domain.repository.ProjectRelationshipRepository;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;
import io.choerodon.iam.infra.mapper.ProjectRelationshipMapper;

/**
 * @author Eugen
 */
@Component
public class ProjectRelationshipRepositoryImpl implements ProjectRelationshipRepository {
    ProjectRelationshipMapper projectRelationshipMapper;

    public ProjectRelationshipRepositoryImpl(ProjectRelationshipMapper projectRelationshipMapper) {
        this.projectRelationshipMapper = projectRelationshipMapper;
    }

    @Override
    public List<ProjectRelationshipDTO> seleteProjectsByParentId(Long parentId) {
        return projectRelationshipMapper.seleteProjectsByParentId(parentId);
    }

    @Override
    public ProjectRelationshipDO addProjToGroup(ProjectRelationshipDTO projectRelationshipDTO) {
        ProjectRelationshipDO projectRelationshipDO = new ProjectRelationshipDO();
        BeanUtils.copyProperties(projectRelationshipDTO, projectRelationshipDO);
        if (projectRelationshipMapper.insertSelective(projectRelationshipDO) != 1) {
            throw new CommonException("error.create.project.group");
        }
        return projectRelationshipDO;
    }

    @Override
    public void deleteGroup(long groupId) {
        if (projectRelationshipMapper.selectByPrimaryKey(groupId) == null) {
            throw new CommonException("error.delete.project.group.not.exist");
        }
        if (projectRelationshipMapper.deleteByPrimaryKey(groupId) != 1) {
            throw new CommonException("error.delete.project.group");
        }
    }

    @Override
    public ProjectRelationshipDO selectByPrimaryKey(Long id) {
        return projectRelationshipMapper.selectByPrimaryKey(id);
    }

    @Override
    public ProjectRelationshipDO update(ProjectRelationshipDO projectRelationshipDO) {
        if (projectRelationshipMapper.updateByPrimaryKeySelective(projectRelationshipDO) != 1) {
            throw new CommonException("error.project.group.update");
        }
        return projectRelationshipMapper.selectByPrimaryKey(projectRelationshipDO.getId());
    }

    @Override
    public ProjectRelationshipDO selectOne(ProjectRelationshipDO projectRelationshipDO) {
        return projectRelationshipMapper.selectOne(projectRelationshipDO);
    }

    @Override
    public List<ProjectRelationshipDO> select(ProjectRelationshipDO projectRelationshipDO) {
        return projectRelationshipMapper.select(projectRelationshipDO);
    }
}
