package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.OrganizationWithRoleDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrganizationWithRolesConvert implements ConvertorI<Object, OrganizationDO, OrganizationWithRoleDTO> {

    @Override
    public OrganizationWithRoleDTO doToDto(OrganizationDO dataObject) {
        OrganizationWithRoleDTO organizationWithRoleDTO = new OrganizationWithRoleDTO();
        BeanUtils.copyProperties(dataObject, organizationWithRoleDTO);
        dataObject.getRoles().forEach(roleDO -> roleDO.setOrganizationName(dataObject.getName()));
        organizationWithRoleDTO.setRoles(ConvertHelper.convertList(dataObject.getRoles(), RoleDTO.class));
        return organizationWithRoleDTO;
    }
}
