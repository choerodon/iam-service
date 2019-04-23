package io.choerodon.iam.domain.service;

import io.choerodon.iam.infra.dto.ProjectDTO;

/**
 * @author superlee
 * @data 2018/4/11
 */
public interface IProjectService {
    ProjectDTO updateProjectEnabled(Long id);

    ProjectDTO updateProjectDisabled(Long id);
}
