//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertHelper;
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.RoleDTO;
//import io.choerodon.iam.api.dto.UserWithRoleDTO;
//import io.choerodon.iam.infra.dataobject.UserDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author flyleft
// * @date 2018/5/30
// */
//@Component
//public class UserWithRoleConverter implements ConvertorI<Object, UserDO, UserWithRoleDTO> {
//
//    @Override
//    public UserWithRoleDTO doToDto(UserDO dataObject) {
//        UserWithRoleDTO userWithRoleDTO = new UserWithRoleDTO();
//        BeanUtils.copyProperties(dataObject, userWithRoleDTO);
//        userWithRoleDTO.setRoles(ConvertHelper.convertList(dataObject.getRoles(), RoleDTO.class));
//        return userWithRoleDTO;
//    }
//}
