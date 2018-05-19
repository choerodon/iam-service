package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.api.dto.RolePermissionDTO;
import io.choerodon.iam.domain.iam.entity.LabelE;
import io.choerodon.iam.domain.iam.entity.PermissionE;
import io.choerodon.iam.domain.iam.entity.RoleE;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.iam.infra.dataobject.RoleDO;

/**
 * @author superlee
 */
@Component
public class RoleConverter implements ConvertorI<RoleE, RoleDO, RoleDTO> {

    @Override
    public RoleE dtoToEntity(RoleDTO dto) {
        RoleE roleE =
                new RoleE(dto.getId(), dto.getName(), dto.getCode(), dto.getDescription(),
                        dto.getLevel(), dto.getEnabled(), dto.getModified(), dto.getEnableForbidden(),
                        dto.getBuiltIn(), dto.getAssignable(), dto.getObjectVersionNumber());
        roleE.setPermissions(ConvertHelper.convertList(dto.getPermissions(), PermissionE.class));
        roleE.setRolePermissions(ConvertHelper.convertList(dto.getRolePermissions(), RolePermissionE.class));
        roleE.setLabels(ConvertHelper.convertList(dto.getLabels(), LabelE.class));
        return roleE;
    }

    @Override
    public RoleDTO entityToDto(RoleE entity) {
        RoleDTO roleDTO = new RoleDTO();
        BeanUtils.copyProperties(entity, roleDTO);
        roleDTO.setPermissions(ConvertHelper.convertList(entity.getPermissions(), PermissionDTO.class));
        roleDTO.setRolePermissions(ConvertHelper.convertList(entity.getRolePermissions(), RolePermissionDTO.class));
        roleDTO.setLabels(ConvertHelper.convertList(entity.getLabels(), LabelDTO.class));
        return roleDTO;
    }

    @Override
    public RoleE doToEntity(RoleDO dataObject) {
        RoleE roleE =
                new RoleE(dataObject.getId(), dataObject.getName(), dataObject.getCode(), dataObject.getDescription(),
                        dataObject.getLevel(), dataObject.getEnabled(),
                        dataObject.getModified(), dataObject.getEnableForbidden(),
                        dataObject.getBuiltIn(), dataObject.getAssignable(), dataObject.getObjectVersionNumber());
        roleE.setPermissions(ConvertHelper.convertList(dataObject.getPermissions(), PermissionE.class));
        roleE.setLabels(ConvertHelper.convertList(dataObject.getLabels(), LabelE.class));
        return roleE;
    }

    @Override
    public RoleDO entityToDo(RoleE entity) {
        RoleDO roleDO = new RoleDO();
        BeanUtils.copyProperties(entity, roleDO);
        roleDO.setPermissions(ConvertHelper.convertList(entity.getPermissions(), PermissionDO.class));
        roleDO.setLabels(ConvertHelper.convertList(entity.getLabels(), LabelDO.class));
        return roleDO;
    }

    @Override
    public RoleDTO doToDto(RoleDO dataObject) {
        RoleDTO roleDTO = new RoleDTO();
        BeanUtils.copyProperties(dataObject, roleDTO);
        roleDTO.setPermissions(ConvertHelper.convertList(dataObject.getPermissions(), PermissionDTO.class));
        roleDTO.setLabels(ConvertHelper.convertList(dataObject.getLabels(), LabelDTO.class));
        return roleDTO;
    }

    @Override
    public RoleDO dtoToDo(RoleDTO dto) {
        RoleDO roleDO = new RoleDO();
        BeanUtils.copyProperties(dto, roleDO);
        roleDO.setPermissions(ConvertHelper.convertList(dto.getPermissions(), PermissionDO.class));
        roleDO.setLabels(ConvertHelper.convertList(dto.getLabels(), LabelDO.class));
        return roleDO;
    }
}
