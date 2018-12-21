package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Set;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectDTO;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author flyleft
 */
public interface ProjectService {

    ProjectDTO queryProjectById(Long projectId);

    Page<UserDTO> pagingQueryTheUsersOfProject(Long id, Long userId, String email, PageRequest pageRequest, String param);

    ProjectDTO update(ProjectDTO projectDTO);

    ProjectDTO disableProject(Long id);

    List<Long> listUserIds(Long projectId);

    List<ProjectDTO> queryByIds(Set<Long> ids);
}
