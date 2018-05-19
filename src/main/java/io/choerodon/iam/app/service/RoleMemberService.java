package io.choerodon.iam.app.service;

import java.util.List;

import io.choerodon.iam.api.dto.MemberRoleDTO;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;

/**
 * @author superlee
 * @author wuguokai
 */
public interface RoleMemberService {

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnSiteLevel(
            Boolean isEdit, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList);

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnOrganizationLevel(
            Boolean isEdit, Long organizationId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList);

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnProjectLevel(
            Boolean isEdit, Long projectId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList);

    void deleteOnSiteLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

    void deleteOnOrganizationLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

    void deleteOnProjectLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

}
