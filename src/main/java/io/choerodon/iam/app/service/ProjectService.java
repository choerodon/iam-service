package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.UserDTO;

/**
 * @author flyleft
 */
public interface ProjectService {

    ProjectDTO queryProjectById(Long projectId);

    Page<UserDTO> pagingQueryTheUsersOfProject(Long id, Long userId, String email, int page, int size, String param);

    ProjectDTO update(ProjectDTO projectDTO);

    ProjectDTO disableProject(Long id);

    Boolean checkProjCode(String code);

    List<Long> listUserIds(Long projectId);

    List<ProjectDTO> queryByIds(Set<Long> ids);
}
