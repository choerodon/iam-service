package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.ProjectRelationshipRepository;
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
    public List<ProjectRelationshipDTO> selectProjectsByParentId(Long parentId, Boolean onlySelectEnable) {
        return projectRelationshipMapper.selectProjectsByParentId(parentId, onlySelectEnable);
    }

    @Override
    public ProjectRelationshipDTO addProjToGroup(ProjectRelationshipDTO projectRelationshipDTO) {
        if (projectRelationshipMapper.insertSelective(projectRelationshipDTO) != 1) {
            throw new CommonException("error.create.project.group");
        }
        return projectRelationshipMapper.selectByPrimaryKey(projectRelationshipDTO.getId());
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
    public ProjectRelationshipDTO selectByPrimaryKey(Long id) {
        return projectRelationshipMapper.selectByPrimaryKey(id);
    }

    @Override
    public ProjectRelationshipDTO update(ProjectRelationshipDTO projectRelationshipDTO) {
        if (projectRelationshipMapper.updateByPrimaryKey(projectRelationshipDTO) != 1) {
            throw new CommonException("error.project.group.update");
        }
        return projectRelationshipMapper.selectByPrimaryKey(projectRelationshipDTO.getId());
    }

    @Override
    public ProjectRelationshipDTO selectOne(ProjectRelationshipDTO projectRelationshipDTO) {
        return projectRelationshipMapper.selectOne(projectRelationshipDTO);
    }

    @Override
    public List<ProjectRelationshipDTO> select(ProjectRelationshipDTO projectRelationshipDTO) {
        return projectRelationshipMapper.select(projectRelationshipDTO);
    }
}
