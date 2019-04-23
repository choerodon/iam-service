//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.MemberRoleDTO;
//import io.choerodon.iam.domain.iam.entity.MemberRoleE;
//import io.choerodon.iam.infra.dataobject.MemberRoleDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author superlee
// * @data 2018/3/29
// */
//@Component
//public class MemberRoleConverter implements ConvertorI<MemberRoleE, MemberRoleDO, MemberRoleDTO> {
//
//    @Override
//    public MemberRoleE dtoToEntity(MemberRoleDTO dto) {
//        return new MemberRoleE(dto.getId(), dto.getRoleId(), dto.getMemberId(), dto.getMemberType(),
//                dto.getSourceId(), dto.getSourceType());
//    }
//
//    @Override
//    public MemberRoleDTO entityToDto(MemberRoleE entity) {
//        MemberRoleDTO memberRoleDTO = new MemberRoleDTO();
//        BeanUtils.copyProperties(entity, memberRoleDTO);
//        return memberRoleDTO;
//    }
//
//    @Override
//    public MemberRoleE doToEntity(MemberRoleDO dataObject) {
//        return new MemberRoleE(dataObject.getId(), dataObject.getRoleId(),
//                dataObject.getMemberId(), dataObject.getMemberType(),
//                dataObject.getSourceId(), dataObject.getSourceType());
//    }
//
//    @Override
//    public MemberRoleDO entityToDo(MemberRoleE entity) {
//        MemberRoleDO memberRoleDO = new MemberRoleDO();
//        BeanUtils.copyProperties(entity, memberRoleDO);
//        return memberRoleDO;
//    }
//
//    @Override
//    public MemberRoleDTO doToDto(MemberRoleDO dataObject) {
//        MemberRoleDTO memberRoleDTO = new MemberRoleDTO();
//        BeanUtils.copyProperties(dataObject, memberRoleDTO);
//        return memberRoleDTO;
//    }
//
//    @Override
//    public MemberRoleDO dtoToDo(MemberRoleDTO dto) {
//        MemberRoleDO memberRoleDO = new MemberRoleDO();
//        BeanUtils.copyProperties(dto, memberRoleDO);
//        return memberRoleDO;
//    }
//}
