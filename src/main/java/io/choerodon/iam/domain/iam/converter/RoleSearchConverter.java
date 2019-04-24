//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.RoleSearchDTO;
//import io.choerodon.iam.infra.dataobject.RoleDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author superlee
// */
//@Component
//public class RoleSearchConverter implements ConvertorI<Object, RoleDO, RoleSearchDTO> {
//
//    @Override
//    public RoleDO dtoToDo(RoleSearchDTO dto) {
//        RoleDO roleDO = new RoleDO();
//        BeanUtils.copyProperties(dto, roleDO);
//        return roleDO;
//    }
//
//}
