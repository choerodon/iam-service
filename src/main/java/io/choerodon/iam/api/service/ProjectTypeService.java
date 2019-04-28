package io.choerodon.iam.api.service;


import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.ProjectTypeDTO;

import java.util.List;

public interface ProjectTypeService {

    List<ProjectTypeDTO> list();

    PageInfo<ProjectTypeDTO> pagingQuery(int page, int size, String name, String code, String param);

    ProjectTypeDTO create(ProjectTypeDTO projectTypeDTO);

    ProjectTypeDTO update(Long id, ProjectTypeDTO projectTypeDTO);

    void check(ProjectTypeDTO projectTypeDTO);
}
