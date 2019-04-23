//package io.choerodon.iam.infra.asserts;
//
//import io.choerodon.core.exception.CommonException;
//import io.choerodon.iam.infra.dto.RoleDTO;
//import io.choerodon.iam.infra.mapper.RoleMapper;
//import org.springframework.stereotype.Component;
//
///**
// * 角色断言帮助类
// *
// * @author superlee
// * @since 2019-04-15
// */
//@Component
//public class RoleAssertHelper {
//
//    private RoleMapper roleMapper;
//
//    public RoleAssertHelper(RoleMapper roleMapper) {
//        this.roleMapper = roleMapper;
//    }
//
//    public void codeExisted(String code){
//        RoleDTO dto = new RoleDTO();
//        dto.setCode(code);
//        if(!roleMapper.select(dto).isEmpty()) {
//            throw new CommonException("error.role.code.existed");
//        }
//    }
//
//    public RoleDTO roleNotExisted(Long id) {
//        return roleNotExisted(id, "error.role.not.exist");
//    }
//
//    public RoleDTO roleNotExisted(Long id, String message) {
//        RoleDTO dto = roleMapper.selectByPrimaryKey(id);
//        if (dto == null) {
//            throw new CommonException(message, id);
//        }
//        return dto;
//    }
//}
