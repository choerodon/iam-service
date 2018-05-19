package io.choerodon.iam.domain.iam.converter;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertorI;
import io.choerodon.iam.api.dto.LanguageDTO;
import io.choerodon.iam.domain.iam.entity.LanguageE;
import io.choerodon.iam.infra.dataobject.LanguageDO;

/**
 * @author superlee
 */
@Component
public class LanguageConverter implements ConvertorI<LanguageE, LanguageDO, LanguageDTO> {

    @Override
    public LanguageE dtoToEntity(LanguageDTO dto) {
        LanguageE languageE = new LanguageE();
        BeanUtils.copyProperties(dto, languageE);
        return languageE;
    }

    @Override
    public LanguageE doToEntity(LanguageDO dataObject) {
        LanguageE languageE = new LanguageE();
        BeanUtils.copyProperties(dataObject, languageE);
        return languageE;
    }

    @Override
    public LanguageDTO entityToDto(LanguageE entity) {
        LanguageDTO languageDTO = new LanguageDTO();
        BeanUtils.copyProperties(entity, languageDTO);
        return languageDTO;
    }

    @Override
    public LanguageDO entityToDo(LanguageE entity) {
        LanguageDO languageDO = new LanguageDO();
        BeanUtils.copyProperties(entity, languageDO);
        return languageDO;
    }

    @Override
    public LanguageDTO doToDto(LanguageDO dataObject) {
        LanguageDTO dto = new LanguageDTO();
        BeanUtils.copyProperties(dataObject, dto);
        return dto;
    }

    @Override
    public LanguageDO dtoToDo(LanguageDTO dto) {
        LanguageDO languageDO = new LanguageDO();
        BeanUtils.copyProperties(dto, languageDO);
        return languageDO;
    }

}
