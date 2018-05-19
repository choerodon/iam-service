package io.choerodon.iam.domain.service;

import io.choerodon.iam.domain.iam.entity.ProjectE;

/**
 * @author superlee
 * @data 2018/4/11
 */
public interface IProjectService {
    ProjectE updateProjectEnabled(Long id);

    ProjectE updateProjectDisabled(Long id);
}
