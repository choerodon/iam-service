package io.choerodon.iam.api.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ProjectTypeDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

public interface ProjectTypeService {

    List<ProjectTypeDTO> list();

    Page<ProjectTypeDTO> pagingQuery(PageRequest pageRequest, String name, String code, String param);

    ProjectTypeDTO create(ProjectTypeDTO projectTypeDTO);

    ProjectTypeDTO update(Long id, ProjectTypeDTO projectTypeDTO);

    void check(ProjectTypeDTO projectTypeDTO);
}
