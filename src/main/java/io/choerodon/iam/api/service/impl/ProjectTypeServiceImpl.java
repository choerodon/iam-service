package io.choerodon.iam.api.service.impl;

import io.choerodon.core.domain.Page;
import io.choerodon.core.domain.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.ProjectTypeDTO;
import io.choerodon.iam.api.service.ProjectTypeService;
import io.choerodon.iam.infra.dataobject.ProjectTypeDO;
import io.choerodon.iam.infra.mapper.ProjectTypeMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.ObjectUtils;

import java.util.List;

/**
 * @author superlee
 */
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

    @Override
    public Page<ProjectTypeDTO> pagingQuery(PageRequest pageRequest, String name, String code, String param) {
        Page<ProjectTypeDO> projectTypes =
                PageHelper.doPageAndSort(pageRequest, () -> projectTypeMapper.fuzzyQuery(name, code, param));
        List<ProjectTypeDTO> dtos =
                modelMapper.map(projectTypes.getContent(), new TypeToken<List<ProjectTypeDTO>>() {
                }.getType());
        return new Page<>(dtos, new PageInfo(projectTypes.getNumber(), projectTypes.getSize()), projectTypes.getTotalElements());
    }

    @Override
    public ProjectTypeDTO create(ProjectTypeDTO projectTypeDTO) {
        ProjectTypeDO projectTypeDO = modelMapper.map(projectTypeDTO, ProjectTypeDO.class);
        if (projectTypeMapper.insertSelective(projectTypeDO) != 1) {
            throw new CommonException("error.projectType.insert");
        }
        return modelMapper.map(projectTypeMapper.selectByPrimaryKey(projectTypeDO.getId()), ProjectTypeDTO.class);
    }

    @Override
    public ProjectTypeDTO update(Long id, ProjectTypeDTO projectTypeDTO) {
        Assert.notNull(projectTypeDTO.getObjectVersionNumber(), "error.objectVersionNumber.null");
        if (projectTypeMapper.selectByPrimaryKey(id) == null) {
            throw new CommonException("error.projectType.not.exist");
        }
        ProjectTypeDO projectTypeDO = modelMapper.map(projectTypeDTO, ProjectTypeDO.class);
        projectTypeDO.setCode(null);
        if (projectTypeMapper.updateByPrimaryKeySelective(projectTypeDO) != 1) {
            throw new CommonException("error.projectType.update");
        }
        return modelMapper.map(projectTypeMapper.selectByPrimaryKey(id), ProjectTypeDTO.class);
    }

    @Override
    public void check(ProjectTypeDTO projectTypeDTO) {
        Assert.notNull(projectTypeDTO.getCode(), "error.projectType.code.illegal");
        boolean updateCheck = !ObjectUtils.isEmpty(projectTypeDTO.getId());
        ProjectTypeDO example = new ProjectTypeDO();
        example.setCode(projectTypeDTO.getCode());
        if (updateCheck) {
            long id = projectTypeDTO.getId();
            ProjectTypeDO projectTypeDO = projectTypeMapper.selectOne(example);
            if (!ObjectUtils.isEmpty(projectTypeDO) && !projectTypeDO.getId().equals(id)) {
                throw new CommonException("error.projectType.code.existed");
            }
        } else {
            if (!projectTypeMapper.select(example).isEmpty()) {
                throw new CommonException("error.projectType.code.existed");
            }
        }
    }

}
