package io.choerodon.iam.api.service.impl;

import io.choerodon.iam.api.dto.ProjectTypeDTO;
import io.choerodon.iam.api.service.ProjectTypeService;
import io.choerodon.iam.infra.mapper.ProjectTypeMapper;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectTypeServiceImpl implements ProjectTypeService {

    private final ModelMapper modelMapper = new ModelMapper();

    private ProjectTypeMapper projectTypeMapper;

    public ProjectTypeServiceImpl(ProjectTypeMapper projectTypeMapper) {
        this.projectTypeMapper = projectTypeMapper;
    }

    @Override
    public List<ProjectTypeDTO> list() {
        return modelMapper.map(projectTypeMapper.selectAll(), new TypeToken<List<ProjectTypeDTO>>() {
        }.getType());
    }

}
