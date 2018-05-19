package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.MenuConfigDTO;
import io.choerodon.iam.domain.iam.entity.MenuConfigE;
import io.choerodon.iam.infra.dataobject.MenuConfigDO;

/**
 * @author wuguokai
 */
@Component
public class MenuConfigConvertor implements ConvertorI<MenuConfigDO, MenuConfigE, MenuConfigDTO> {
    @Override
    public MenuConfigDO dtoToEntity(MenuConfigDTO dto) {
        MenuConfigDO menuConfigDO = new MenuConfigDO();
        BeanUtils.copyProperties(dto, menuConfigDO);
        return menuConfigDO;
    }

    @Override
    public MenuConfigDTO entityToDto(MenuConfigDO entity) {
        MenuConfigDTO menuConfigDTO = new MenuConfigDTO();
        BeanUtils.copyProperties(entity, menuConfigDTO);
        return menuConfigDTO;
    }

    @Override
    public MenuConfigDO doToEntity(MenuConfigE dataObject) {
        MenuConfigDO menuConfigDO = new MenuConfigDO();
        BeanUtils.copyProperties(dataObject, menuConfigDO);
        return menuConfigDO;
    }

    @Override
    public MenuConfigE entityToDo(MenuConfigDO entity) {
        MenuConfigE menuConfigE = new MenuConfigE();
        BeanUtils.copyProperties(entity, menuConfigE);
        return menuConfigE;
    }

    @Override
    public MenuConfigDTO doToDto(MenuConfigE dataObject) {
        MenuConfigDTO menuConfigDTO = new MenuConfigDTO();
        BeanUtils.copyProperties(dataObject, menuConfigDTO);
        return menuConfigDTO;
    }

    @Override
    public MenuConfigE dtoToDo(MenuConfigDTO dto) {
        MenuConfigE menuConfigE = new MenuConfigE();
        BeanUtils.copyProperties(dto, menuConfigE);
        return menuConfigE;
    }
}
