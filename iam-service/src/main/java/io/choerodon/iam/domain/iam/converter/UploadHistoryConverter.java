//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.UploadHistoryDTO;
//import io.choerodon.iam.infra.dataobject.UploadHistoryDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author superlee
// */
//@Component
//public class UploadHistoryConverter implements ConvertorI<Object, UploadHistoryDO, UploadHistoryDTO> {
//
//    @Override
//    public UploadHistoryDTO doToDto(UploadHistoryDO dataObject) {
//        UploadHistoryDTO dto = new UploadHistoryDTO();
//        BeanUtils.copyProperties(dataObject, dto);
//        return dto;
//    }
//
//    @Override
//    public UploadHistoryDO dtoToDo(UploadHistoryDTO dto) {
//        UploadHistoryDO dataObject = new UploadHistoryDO();
//        BeanUtils.copyProperties(dto, dataObject);
//        return dataObject;
//    }
//
//}
