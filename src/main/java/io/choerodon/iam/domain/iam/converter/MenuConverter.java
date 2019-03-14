package io.choerodon.iam.domain.iam.converter;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.MenuDTO;
import io.choerodon.iam.api.dto.PermissionDTO;
import io.choerodon.iam.domain.iam.entity.MenuE;
import io.choerodon.iam.infra.dataobject.MenuDO;

/**
 * @author wuguokai
 */
@Component
public class MenuConverter implements ConvertorI<MenuE, MenuDO, MenuDTO> {

    @Override
    public MenuE doToEntity(MenuDO dataObject) {
        MenuE menuE = new MenuE(dataObject.getCode(), dataObject.getName(), dataObject.getLevel(),
                dataObject.getParentId(), dataObject.getType(), dataObject.getSort(), dataObject.getDefault(),
                dataObject.getIcon(), dataObject.getRoute(), dataObject.getCategory(), dataObject.getObjectVersionNumber());
        menuE.setId(dataObject.getId());
        return menuE;
    }

    @Override
    public MenuDO entityToDo(MenuE entity) {
        MenuDO menuDO = new MenuDO();
        BeanUtils.copyProperties(entity, menuDO);
        return menuDO;
    }

    @Override
    public MenuE dtoToEntity(MenuDTO dto) {
        MenuE menuE = new MenuE(dto.getCode(), dto.getName(), dto.getLevel(),
                dto.getParentId(), dto.getType(), dto.getSort(), dto.getDefault(), dto.getIcon(),
                dto.getRoute(), dto.getCategory(), dto.getObjectVersionNumber());
        menuE.setId(dto.getId());
        return menuE;
    }

    @Override
    public MenuDTO entityToDto(MenuE entity) {
        MenuDTO menuDTO = new MenuDTO();
        BeanUtils.copyProperties(entity, menuDTO);
        return menuDTO;
    }

    @Override
    public MenuDTO doToDto(MenuDO dataObject) {
        MenuDTO menuDTO = new MenuDTO();
        BeanUtils.copyProperties(dataObject, menuDTO);
        List<PermissionDTO> permissionDTOList =
                ConvertHelper.convertList(dataObject.getPermissions(), PermissionDTO.class);
        menuDTO.setPermissions(permissionDTOList);
        return menuDTO;
    }

    @Override
    public MenuDO dtoToDo(MenuDTO dto) {
        MenuDO menuDO = new MenuDO();
        BeanUtils.copyProperties(dto, menuDO);
        return menuDO;
    }
}
