package io.choerodon.iam.domain.iam.converter;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.IconDTO;
import io.choerodon.iam.infra.dataobject.IconDO;

/**
 * @author superlee
 * @data 2018-04-11
 */
@Component
public class IconConvertor implements ConvertorI<Object, IconDO, IconDTO> {

    @Override
    public IconDTO doToDto(IconDO dataObject) {
        IconDTO iconDTO = new IconDTO();
        iconDTO.setId(dataObject.getId());
        iconDTO.setCode(dataObject.getCode());
        iconDTO.setObjectVersionNumber(dataObject.getObjectVersionNumber());
        return iconDTO;
    }

    @Override
    public IconDO dtoToDo(IconDTO dto) {
        IconDO iconDO = new IconDO();
        iconDO.setId(dto.getId());
        iconDO.setCode(dto.getCode());
        iconDO.setObjectVersionNumber(dto.getObjectVersionNumber());
        return iconDO;
    }

}
