package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.service.IProjectService;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;

/**
 * @author superlee
 * @data 2018/4/11
 */
@Service
public class IProjectServiceImpl extends BaseServiceImpl<ProjectDTO> implements IProjectService {

    private ProjectRepository projectRepository;

    public IProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ProjectDTO updateProjectEnabled(Long id) {
        ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(id);
        if (projectDTO == null) {
            throw new CommonException("error.project.not.exist");
        }
        projectDTO.setEnabled(true);
        return projectRepository.updateSelective(projectDTO);
    }

    @Override
    public ProjectDTO updateProjectDisabled(Long id) {
        ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(id);
        if (projectDTO == null) {
            throw new CommonException("error.project.not.exist");
        }
        projectDTO.setEnabled(false);
        return projectRepository.updateSelective(projectDTO);
    }
}
