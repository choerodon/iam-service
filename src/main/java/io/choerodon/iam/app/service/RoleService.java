package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.dto.RoleDTO;
import io.choerodon.iam.api.dto.RoleSearchDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;

/**
 * @author superlee
 * @author wuguokai
 */
public interface RoleService {

    Page<RoleDTO> pagingQuery(PageRequest pageRequest, Boolean needUsers, Long sourceId, String sourceType, RoleSearchDTO role);

    RoleDTO create(RoleDTO roleDTO);

    RoleDTO createBaseOnRoles(RoleDTO roleDTO);

    RoleDTO update(RoleDTO roleDTO);

    void delete(Long id);

    RoleDTO queryById(Long id);

    RoleDTO enableRole(Long id);

    RoleDTO disableRole(Long id);

    RoleDTO queryWithPermissionsAndLabels(Long id);

    List<RoleDTO> listRolesWithUserCountOnSiteLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    List<RoleDTO> listRolesWithClientCountOnSiteLevel(ClientRoleSearchDTO clientRoleSearchDTO);

    List<RoleDTO> listRolesWithUserCountOnOrganizationLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId);

    List<RoleDTO> listRolesWithClientCountOnOrganizationLevel(ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId);

    List<RoleDTO> listRolesWithUserCountOnProjectLevel(RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId);

    List<RoleDTO> listRolesWithClientCountOnProjectLevel(ClientRoleSearchDTO clientRoleSearchDTO, Long sourceId);

    void check(RoleDTO role);

    List<Long> queryIdsByLabelNameAndLabelType(String labelName, String labelType);

    List<RoleDTO> listRolesBySourceIdAndTypeAndUserId(String sourceType, Long sourceId, Long userId);

    RoleDTO queryByCode(String code);
}
