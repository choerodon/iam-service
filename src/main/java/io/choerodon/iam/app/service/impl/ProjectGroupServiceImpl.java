package io.choerodon.iam.app.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectGroupDTO;
import io.choerodon.iam.app.service.ProjectGroupService;
import io.choerodon.iam.domain.repository.ProjectGroupRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.ProjectGroupDO;

/**
 * @author Eugen
 */
@Service
public class ProjectGroupServiceImpl implements ProjectGroupService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectGroupServiceImpl.class);

    private ProjectGroupRepository projectGroupRepository;
    private ProjectRepository projectRepository;

    public ProjectGroupServiceImpl(ProjectRepository projectRepository, ProjectGroupRepository projectGroupRepository) {
        this.projectGroupRepository = projectGroupRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public List<ProjectGroupDTO> getProjUnderGroup(Long projectId) {
        ProjectDO projectDO = projectRepository.selectByPrimaryKey(projectId);
        if (projectDO == null) {
            throw new CommonException("error.parent.project.not.exist");

        }
        if (!projectDO.getGroup()) {
            throw new CommonException("error.parent.project.is.not.group");
        }
        return projectGroupRepository.seleteProjectsByParentId(projectId);
    }

    @Override
    public void removesAProjUnderGroup(Long groupId) {
        ProjectGroupDO projectGroupDO = projectGroupRepository.selectByPrimaryKey(groupId);
        if (projectGroupDO == null) {
            throw new CommonException("error.project.group.not.exist");
        }
        projectGroupRepository.deleteGroup(groupId);
    }

    @Override
    @Transactional
    public List<ProjectGroupDTO> batchAddProjsToTheGroup(List<ProjectGroupDTO> list) {
        list.forEach(projectGroupDTO -> {
            //parent校验，不能为空且is_group=true
            ProjectDO parent = projectRepository.selectByPrimaryKey(projectGroupDTO.getParentId());
            if (parent == null) {
                throw new CommonException("error.parent.project.not.exist");
            }
            if (!parent.getGroup()) {
                throw new CommonException("error.parent.project.is.not.group");
            }
            //project校验，不能为空且is_group=false
            ProjectDO son = projectRepository.selectByPrimaryKey(projectGroupDTO.getProjectId());
            if (son == null) {
                throw new CommonException("error.son.project.not.exist");
            } else if (son.getGroup()) {
                throw new CommonException("error.son.project.is.group");
            }

            ProjectGroupDO checkDO = new ProjectGroupDO();
            checkDO.setParentId(projectGroupDTO.getParentId());
            checkDO.setProjectId(projectGroupDTO.getProjectId());
            if (projectGroupRepository.selectOne(checkDO) != null) {
                throw new CommonException("error.group.exist");
            }
            BeanUtils.copyProperties(projectGroupRepository.addProjToGroup(projectGroupDTO), projectGroupDTO);
        });
        return list;
    }

    @Override
    public List<ProjectGroupDTO> batchModifyProjsToTheGroup(List<ProjectGroupDTO> list) {
        list.forEach(i -> {
            if (projectGroupRepository.selectByPrimaryKey(i.getId()) == null) {
                logger.warn("Batch update groupProjects exist Nonexistent groupProject,id is{}:{}", i.getId(), i);
            } else {
                ProjectGroupDO projectGroupDO = new ProjectGroupDO();
                BeanUtils.copyProperties(i, projectGroupDO);
                projectGroupDO = projectGroupRepository.update(projectGroupDO);
                BeanUtils.copyProperties(projectGroupDO, i);
            }
        });
        return list;
    }

    @Override
    public ProjectGroupDTO updateGroupDate(ProjectGroupDTO projectGroupDTO) {
        if (projectGroupRepository.selectByPrimaryKey(projectGroupDTO.getId()) == null) {
            throw new CommonException("error.update.group.id.not.exist:" + projectGroupDTO.getId());
        }
        ProjectGroupDO projectGroupDO = new ProjectGroupDO();
        BeanUtils.copyProperties(projectGroupDTO, projectGroupDO);
        BeanUtils.copyProperties(projectGroupRepository.update(projectGroupDO), projectGroupDTO);
        return projectGroupDTO;
    }

    @Override
    public List<ProjectGroupDTO> batchUpdateProjsToTheGroup(List<ProjectGroupDTO> list) {
        List<ProjectGroupDTO> updateNewList = new ArrayList<>();
        List<ProjectGroupDTO> insertNewList = new ArrayList<>();
        list.forEach(g -> {
            if (g.getId() == null) {
                insertNewList.add(g);
            } else {
                updateNewList.add(g);
            }
        });
        List<ProjectGroupDTO> inserted = batchAddProjsToTheGroup(insertNewList);
        List<ProjectGroupDTO> updated = batchModifyProjsToTheGroup(updateNewList);
        inserted.addAll(updated);
        return inserted;
    }
}
