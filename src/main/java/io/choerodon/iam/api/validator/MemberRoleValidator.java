package io.choerodon.iam.api.validator;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.MemberRoleDTO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.mapper.RoleMapper;

/**
 * @author wuguokai
 */
@Component
public class MemberRoleValidator {
    private RoleMapper roleMapper;

    public MemberRoleValidator(RoleMapper roleMapper) {
        this.roleMapper = roleMapper;
    }

    public void distributionRoleValidator(String level, List<MemberRoleDTO> memberRoleDTOS) {
        memberRoleDTOS.forEach(memberRoleDTO -> {
            if (memberRoleDTO.getRoleId() == null) {
                throw new CommonException("error.roleId.null");
            }
            RoleDO roleDO = roleMapper.selectByPrimaryKey(memberRoleDTO.getRoleId());
            if (roleDO == null) {
                throw new CommonException("error.role.not.exist");
            }
            if (!roleDO.getLevel().equals(level)) {
                throw new CommonException("error.roles.in.same.level");
            }
        });
    }
}
