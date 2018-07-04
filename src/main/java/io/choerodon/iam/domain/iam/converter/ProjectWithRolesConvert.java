package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.ProjectWithRoleDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

@Component
public class ProjectWithRolesConvert implements ConvertorI<Object, ProjectDO, ProjectWithRoleDTO> {

    @Override
    public ProjectWithRoleDTO doToDto(ProjectDO dataObject) {
        ProjectWithRoleDTO projectWithRoleDTO = new ProjectWithRoleDTO();
        BeanUtils.copyProperties(dataObject, projectWithRoleDTO);
        projectWithRoleDTO.setRoles(ConvertHelper.convertList(dataObject.getRoles(), RoleDTO.class));
        return projectWithRoleDTO;
    }
}
