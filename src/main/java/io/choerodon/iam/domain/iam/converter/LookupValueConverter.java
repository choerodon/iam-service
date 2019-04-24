//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.LookupValueDTO;
//import io.choerodon.iam.domain.iam.entity.LookupValueE;
//import io.choerodon.iam.infra.dataobject.LookupValueDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author superlee
// */
//@Component
//public class LookupValueConverter implements ConvertorI<LookupValueE, LookupValueDO, LookupValueDTO> {
//
//    @Override
//    public LookupValueE dtoToEntity(LookupValueDTO dto) {
//        LookupValueE lookupValueE = new LookupValueE();
//        BeanUtils.copyProperties(dto, lookupValueE);
//        return lookupValueE;
//    }
//
//    @Override
//    public LookupValueE doToEntity(LookupValueDO dataObject) {
//        LookupValueE lookupValueE = new LookupValueE();
//        BeanUtils.copyProperties(dataObject, lookupValueE);
//        return lookupValueE;
//    }
//
//    @Override
//    public LookupValueDTO entityToDto(LookupValueE entity) {
//        LookupValueDTO dto = new LookupValueDTO();
//        BeanUtils.copyProperties(entity, dto);
//        return dto;
//    }
//
//    @Override
//    public LookupValueDO entityToDo(LookupValueE entity) {
//        LookupValueDO lookupValueDO = new LookupValueDO();
//        BeanUtils.copyProperties(entity, lookupValueDO);
//        return lookupValueDO;
//    }
//}
