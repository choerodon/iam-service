package io.choerodon.iam.api.validator;

import java.util.List;

import io.choerodon.iam.infra.dto.MemberRoleDTO;
import io.choerodon.iam.infra.dto.RoleDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.oauth.CustomUserDetails;
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
            RoleDTO roleDTO = roleMapper.selectByPrimaryKey(memberRoleDTO.getRoleId());
            if (roleDTO == null) {
                throw new CommonException("error.role.not.exist");
            }
            if (!roleDTO.getResourceLevel().equals(level)) {
                throw new CommonException("error.roles.in.same.level");
            }
        });
    }

    public Boolean userHasRoleValidator(CustomUserDetails userDetails, String sourceType, Long sourceId, Boolean isAdmin) {
        if (!isAdmin) {
            MemberRoleDTO memberRoleDTO = new MemberRoleDTO();
            memberRoleDTO.setMemberId(userDetails.getUserId());
            memberRoleDTO.setMemberType("user");
            memberRoleDTO.setSourceType(sourceType);
            memberRoleDTO.setSourceId(sourceId);
            if (memberRoleMapper.select(memberRoleDTO).isEmpty()) {
                throw new CommonException("error.memberRole.select");
            }
        }
        return true;
    }
}
