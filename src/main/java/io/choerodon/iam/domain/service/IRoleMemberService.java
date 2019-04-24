package io.choerodon.iam.domain.service;

import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.infra.dto.MemberRoleDTO;

import java.util.List;

/**
 * @author superlee
 * @date 2018/4/2
 */
public interface IRoleMemberService {

    List<MemberRoleDTO> insertOrUpdateRolesOfUserByMemberId(
            Boolean isEdit, Long sourceId, Long memberId, List<MemberRoleDTO> memberRoles, String sourceType);

    List<MemberRoleDTO> insertOrUpdateRolesOfClientByMemberId(
            Boolean isEdit, Long sourceId, Long memberId, List<MemberRoleDTO> memberRoles, String sourceType);

    void delete(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO, String sourceType);

    /**
     * 批量删除客户端及角色之间的关系
     *
     * @param roleAssignmentDeleteDTO 数据
     * @param sourceType              sourceType
     */
    void deleteClientAndRole(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO, String sourceType);

    void insertAndSendEvent(MemberRoleDTO memberRole, String loginName);
}
