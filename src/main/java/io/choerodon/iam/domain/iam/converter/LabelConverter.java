//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.LabelDTO;
//import io.choerodon.iam.domain.iam.entity.LabelE;
//import io.choerodon.iam.infra.dataobject.LabelDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author superlee
// */
//@Component
//public class LabelConverter implements ConvertorI<LabelE, LabelDO, LabelDTO> {
//
//    @Override
//    public LabelE dtoToEntity(LabelDTO dto) {
//        LabelE entity = new LabelE();
//        BeanUtils.copyProperties(dto, entity);
//        return entity;
//    }
//
//    @Override
//    public LabelDTO entityToDto(LabelE entity) {
//        LabelDTO labelDTO = new LabelDTO();
//        BeanUtils.copyProperties(entity, labelDTO);
//        return labelDTO;
//    }
//
//    @Override
//    public LabelE doToEntity(LabelDO dataObject) {
//        LabelE entity = new LabelE();
//        BeanUtils.copyProperties(dataObject, entity);
//        return entity;
//    }
//
//    @Override
//    public LabelDO entityToDo(LabelE entity) {
//        LabelDO labelDO = new LabelDO();
//        BeanUtils.copyProperties(entity, labelDO);
//        return labelDO;
//    }
//
//    @Override
//    public LabelDTO doToDto(LabelDO dataObject) {
//        LabelDTO labelDTO = new LabelDTO();
//        BeanUtils.copyProperties(dataObject, labelDTO);
//        return labelDTO;
//    }
//
//    @Override
//    public LabelDO dtoToDo(LabelDTO dto) {
//        LabelDO labelDO = new LabelDO();
//        BeanUtils.copyProperties(dto, labelDO);
//        return labelDO;
//    }
//
//}
