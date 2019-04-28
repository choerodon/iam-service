package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.RoleAssignmentDeleteDTO;
import io.choerodon.iam.infra.dto.ClientDTO;
import io.choerodon.iam.infra.dto.MemberRoleDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * @author superlee
 * @author wuguokai
 * @author zmf
 */
public interface RoleMemberService {

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnSiteLevel(
            Boolean isEdit, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList, String memberType);

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnOrganizationLevel(
            Boolean isEdit, Long organizationId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList, String memberType);

    PageInfo<ClientDTO> pagingQueryClientsWithOrganizationLevelRoles(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId);


    PageInfo<ClientDTO> pagingQueryClientsWithSiteLevelRoles(int page, int size, ClientRoleSearchDTO clientRoleSearchDTO);

    PageInfo<ClientDTO> pagingQueryClientsWithProjectLevelRoles(int page,int size, ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId);

    List<MemberRoleDTO> createOrUpdateRolesByMemberIdOnProjectLevel(
            Boolean isEdit, Long projectId, List<Long> memberIds, List<MemberRoleDTO> memberRoleDTOList, String memberType);

    void deleteOnSiteLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

    void deleteOnOrganizationLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

    void deleteOnProjectLevel(RoleAssignmentDeleteDTO roleAssignmentDeleteDTO);

    ResponseEntity<Resource> downloadTemplates(String suffix);

    void import2MemberRole(Long sourceId, String sourceType, MultipartFile file);
}
