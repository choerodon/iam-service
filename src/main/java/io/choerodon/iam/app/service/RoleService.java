package io.choerodon.iam.app.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.ClientRoleSearchDTO;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.query.RoleQuery;
import io.choerodon.iam.infra.dto.RoleDTO;

import java.util.List;

/**
 * @author superlee
 * @author wuguokai
 */
public interface RoleService {

    PageInfo<RoleDTO> pagingSearch(int page, int size, RoleQuery roleQuery);

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
