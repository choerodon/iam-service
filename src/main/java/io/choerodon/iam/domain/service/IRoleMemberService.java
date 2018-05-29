package io.choerodon.iam.domain.service;

import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;

import java.util.List;

/**
 * @author superlee
 * @data 2018/4/2
 */
public interface IRoleMemberService {
    void deleteByIdOnSiteLevel(Long id);

    void deleteByIdOnOrganizationLevel(Long id, Long organizationId);

    void deleteByIdOnProjectLevel(Long id, Long projectId);

    List<MemberRoleE> insertOrUpdateRolesByMemberId(
            Boolean isEdit, Long sourceId, Long memberId, List<MemberRoleE> memberRoleEList, String sourceType);

    void delete(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO, String sourceType);
}
