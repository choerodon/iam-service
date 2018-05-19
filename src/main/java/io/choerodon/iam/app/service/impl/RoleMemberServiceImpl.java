package io.choerodon.iam.app.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.MemberRoleDTO;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.app.service.RoleMemberService;
import io.choerodon.iam.domain.iam.entity.MemberRoleE;
import io.choerodon.iam.domain.service.IRoleMemberService;

/**
 * @author superlee
 * @author wuguokai
 */
@Component
public class RoleMemberServiceImpl implements RoleMemberService {


    private IRoleMemberService iRoleMemberService;


    public RoleMemberServiceImpl(IRoleMemberService iRoleMemberService) {
        this.iRoleMemberService = iRoleMemberService;
    }


    @Transactional(rollbackFor = CommonException.class)
    @Override
    public List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnSiteLevel(Boolean isEdit, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList) {
        List<MemberRoleDTO> memberRoleDTOS = new ArrayList<>();
        for (Long memberId : memberIds) {
            memberRoleDTOList.forEach(m ->
                    m.setMemberId(memberId)
            );
            memberRoleDTOS.addAll(ConvertHelper.convertList(
                    iRoleMemberService.insertOrUpdateRolesByMemberId(isEdit, 0L, memberId, ConvertHelper.convertList(
                            memberRoleDTOList, MemberRoleE.class), ResourceLevel.SITE.value()), MemberRoleDTO.class));
        }
        return memberRoleDTOS;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnOrganizationLevel(Boolean isEdit, Long organizationId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList) {
        List<MemberRoleDTO> memberRoleDTOS = new ArrayList<>();
        for (Long memberId : memberIds) {
            memberRoleDTOList.forEach(m ->
                    m.setMemberId(memberId)
            );
            memberRoleDTOS.addAll(ConvertHelper.convertList(
                    iRoleMemberService.insertOrUpdateRolesByMemberId(isEdit, organizationId, memberId,
                            ConvertHelper.convertList(memberRoleDTOList, MemberRoleE.class),
                            ResourceLevel.ORGANIZATION.value()), MemberRoleDTO.class));
        }
        return memberRoleDTOS;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnProjectLevel(Boolean isEdit, Long projectId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList) {
        List<MemberRoleDTO> memberRoleDTOS = new ArrayList<>();
        for (Long memberId : memberIds) {
            memberRoleDTOList.forEach(m ->
                m.setMemberId(memberId)
            );
            memberRoleDTOS.addAll(ConvertHelper.convertList(
                    iRoleMemberService.insertOrUpdateRolesByMemberId(isEdit, projectId, memberId,
                            ConvertHelper.convertList(memberRoleDTOList, MemberRoleE.class),
                            ResourceLevel.PROJECT.value()), MemberRoleDTO.class));
        }
        return memberRoleDTOS;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public void deleteOnSiteLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        iRoleMemberService.delete(roleAssignmentDeleteDTO, ResourceLevel.SITE.value());
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public void deleteOnOrganizationLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        iRoleMemberService.delete(roleAssignmentDeleteDTO, ResourceLevel.ORGANIZATION.value());
    }

    @Override
    public void deleteOnProjectLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO) {
        iRoleMemberService.delete(roleAssignmentDeleteDTO, ResourceLevel.PROJECT.value());
    }

}
