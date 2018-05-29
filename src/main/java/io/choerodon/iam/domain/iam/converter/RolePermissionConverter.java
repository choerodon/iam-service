package io.choerodon.iam.domain.iam.converter;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.RolePermissionDTO;
import io.choerodon.iam.domain.iam.entity.RolePermissionE;
import io.choerodon.iam.infra.dataobject.RolePermissionDO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class RolePermissionConverter implements ConvertorI<RolePermissionE, RolePermissionDO, RolePermissionDTO> {
    @Override
    public RolePermissionDTO doToDto(RolePermissionDO dataObject) {
        RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
        BeanUtils.copyProperties(dataObject, rolePermissionDTO);
        return rolePermissionDTO;
    }

    @Override
    public RolePermissionDO dtoToDo(RolePermissionDTO dto) {
        RolePermissionDO rolePermissionDO = new RolePermissionDO();
        BeanUtils.copyProperties(dto, rolePermissionDO);
        return rolePermissionDO;
    }

    @Override
    public RolePermissionE dtoToEntity(RolePermissionDTO dto) {
        return new RolePermissionE(dto.getId(), dto.getRoleId(), dto.getPermissionId());
    }

    @Override
    public RolePermissionDTO entityToDto(RolePermissionE entity) {
        RolePermissionDTO rolePermissionDTO = new RolePermissionDTO();
        BeanUtils.copyProperties(entity, rolePermissionDTO);
        return rolePermissionDTO;
    }

    @Override
    public RolePermissionE doToEntity(RolePermissionDO dataObject) {
        return new RolePermissionE(dataObject.getId(), dataObject.getRoleId(), dataObject.getPermissionId());
    }

    @Override
    public RolePermissionDO entityToDo(RolePermissionE entity) {
        RolePermissionDO rolePermissionDO = new RolePermissionDO();
        BeanUtils.copyProperties(entity, rolePermissionDO);
        return rolePermissionDO;
    }
}
