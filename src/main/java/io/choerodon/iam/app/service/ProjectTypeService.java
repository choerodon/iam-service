package io.choerodon.iam.app.service;


import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.ProjectTypeDTO;

import java.util.List;

public interface ProjectTypeService {

    List<ProjectTypeDTO> list();

    PageInfo<ProjectTypeDTO> pagingQuery(PageRequest pageRequest, String name, String code, String param);

    ProjectTypeDTO create(ProjectTypeDTO projectTypeDTO);

    ProjectTypeDTO update(Long id, ProjectTypeDTO projectTypeDTO);

    void check(ProjectTypeDTO projectTypeDTO);
}
