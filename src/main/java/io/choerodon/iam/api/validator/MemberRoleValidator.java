package io.choerodon.iam.api.validator;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.iam.api.dto.MemberRoleDTO;
import io.choerodon.iam.infra.dataobject.MemberRoleDO;
import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.iam.infra.mapper.MemberRoleMapper;
import io.choerodon.iam.infra.mapper.RoleMapper;

/**
 * @author wuguokai
 */
@Component
public class MemberRoleValidator {
    private RoleMapper roleMapper;

    private MemberRoleMapper memberRoleMapper;

    public MemberRoleValidator(RoleMapper roleMapper, MemberRoleMapper memberRoleMapper) {
        this.roleMapper = roleMapper;
        this.memberRoleMapper = memberRoleMapper;
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

    public Boolean userHasRoleValidator(CustomUserDetails userDetails, String sourceType, Long sourceId) {
        boolean isAdmin = userDetails.getAdmin() == null ? false : userDetails.getAdmin();
        if (!isAdmin) {
            MemberRoleDO memberRoleDO = new MemberRoleDO();
            memberRoleDO.setMemberId(userDetails.getUserId());
            memberRoleDO.setMemberType("user");
            memberRoleDO.setSourceType(sourceType);
            memberRoleDO.setSourceId(sourceId);
            if (null == memberRoleMapper.selectOne(memberRoleDO)) {
                throw new CommonException("error.memberRole.select");
            }
        }
        return true;
    }
}
