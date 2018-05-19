package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LookupDTO;
import io.choerodon.iam.api.dto.LookupValueDTO;
import io.choerodon.iam.domain.iam.entity.LookupE;
import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.infra.dataobject.LookupDO;

/**
 * @author superlee
 */
@Component
public class LookupConverter implements ConvertorI<LookupE, LookupDO, LookupDTO> {
    @Override
    public LookupE dtoToEntity(LookupDTO dto) {
        LookupE lookupE = new LookupE();
        BeanUtils.copyProperties(dto, lookupE);
        lookupE.setLookupValues(
                ConvertHelper.convertList(
                        dto.getLookupValues(), LookupValueE.class));
        return lookupE;
    }

    @Override
    public LookupE doToEntity(LookupDO dataObject) {
        LookupE lookupE = new LookupE();
        BeanUtils.copyProperties(dataObject, lookupE);
        return lookupE;
    }

    @Override
    public LookupDTO entityToDto(LookupE entity) {
        LookupDTO lookupDTO = new LookupDTO();
        BeanUtils.copyProperties(entity, lookupDTO);
        lookupDTO.setLookupValues(
                ConvertHelper.convertList(
                        entity.getLookupValues(), LookupValueDTO.class));
        return lookupDTO;
    }

    @Override
    public LookupDO entityToDo(LookupE entity) {
        LookupDO lookupDO = new LookupDO();
        BeanUtils.copyProperties(entity, lookupDO);
        return lookupDO;
    }

    @Override
    public LookupDTO doToDto(LookupDO dataObject) {
        LookupDTO lookupDTO = new LookupDTO();
        BeanUtils.copyProperties(dataObject, lookupDTO);
        return lookupDTO;
    }

    @Override
    public LookupDO dtoToDo(LookupDTO dto) {
        LookupDO lookupDO = new LookupDO();
        BeanUtils.copyProperties(dto, lookupDO);
        return lookupDO;
    }
}
