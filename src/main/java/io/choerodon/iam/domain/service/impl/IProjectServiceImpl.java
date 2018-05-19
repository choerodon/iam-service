package io.choerodon.iam.domain.service.impl;

import org.springframework.stereotype.Service;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.ProjectE;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.domain.service.IProjectService;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.service.BaseServiceImpl;

/**
 * @author superlee
 * @data 2018/4/11
 */
@Service
public class IProjectServiceImpl extends BaseServiceImpl<ProjectDO> implements IProjectService {

    private ProjectRepository projectRepository;

    public IProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public ProjectE updateProjectEnabled(Long id) {
        ProjectDO projectDO = projectRepository.selectByPrimaryKey(id);
        if (projectDO == null) {
            throw new CommonException("error.project.not.exist");
        }
        projectDO.setEnabled(true);
        return projectRepository.updateSelective(projectDO);
    }

    @Override
    public ProjectE updateProjectDisabled(Long id) {
        ProjectDO projectDO = projectRepository.selectByPrimaryKey(id);
        if (projectDO == null) {
            throw new CommonException("error.project.not.exist");
        }
        projectDO.setEnabled(false);
        return projectRepository.updateSelective(projectDO);
    }
}
