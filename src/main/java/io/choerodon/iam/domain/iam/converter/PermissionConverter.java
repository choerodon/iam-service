//package io.choerodon.iam.domain.iam.converter;
//
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.PermissionDTO;
//import io.choerodon.iam.domain.iam.entity.PermissionE;
//import io.choerodon.iam.infra.dataobject.PermissionDO;
//
///**
// * @author wuguokai
// */
//@Component
//public class PermissionConverter implements ConvertorI<PermissionE, PermissionDO, PermissionDTO> {
//    @Override
//    public PermissionE dtoToEntity(PermissionDTO dto) {
//        PermissionE permissionE =
//                new PermissionE(dto.getCode(), dto.getPath(), dto.getMethod(), dto.getLevel(), dto.getDescription(),
//                        dto.getAction(), dto.getResource(), dto.getPublicAccess(),
//                        dto.getLoginAccess(), dto.getWithin(), dto.getServiceName(), dto.getObjectVersionNumber());
//        permissionE.setId(dto.getId());
//        return permissionE;
//    }
//
//    @Override
//    public PermissionDTO entityToDto(PermissionE entity) {
//        PermissionDTO permissionDTO = new PermissionDTO();
//        BeanUtils.copyProperties(entity, permissionDTO);
//        return permissionDTO;
//    }
//
//    @Override
//    public PermissionE doToEntity(PermissionDO dataObject) {
//        PermissionE permissionE =
//                new PermissionE(dataObject.getCode(), dataObject.getPath(),
//                        dataObject.getMethod(), dataObject.getLevel(),
//                        dataObject.getDescription(), dataObject.getAction(), dataObject.getResource(),
//                        dataObject.getPublicAccess(), dataObject.getLoginAccess(), dataObject.getWithin(),
//                        dataObject.getServiceName(), dataObject.getObjectVersionNumber());
//        permissionE.setId(dataObject.getId());
//        permissionE.setObjectVersionNumber(dataObject.getObjectVersionNumber());
//        return permissionE;
//    }
//
//    @Override
//    public PermissionDO entityToDo(PermissionE entity) {
//        PermissionDO permissionDO = new PermissionDO();
//        BeanUtils.copyProperties(entity, permissionDO);
//        return permissionDO;
//    }
//
//    @Override
//    public PermissionDTO doToDto(PermissionDO dataObject) {
//        PermissionDTO permissionDTO = new PermissionDTO();
//        BeanUtils.copyProperties(dataObject, permissionDTO);
//        return permissionDTO;
//    }
//
//    @Override
//    public PermissionDO dtoToDo(PermissionDTO dto) {
//        PermissionDO permissionDO = new PermissionDO();
//        BeanUtils.copyProperties(dto, permissionDO);
//        return permissionDO;
//    }
//}
