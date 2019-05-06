package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.UserDTO;

/**
 * @author wuguokai
 */
public interface OrganizationService {

    OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO, String level, Long sourceId);

    OrganizationDTO queryOrganizationById(Long organizationId);

    OrganizationDTO queryOrganizationWithRoleById(Long organizationId);

    PageInfo<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, int page, int size, String param);

    OrganizationDTO enableOrganization(Long organizationId, Long userId);

    OrganizationDTO disableOrganization(Long organizationId, Long userId);

    void check(OrganizationDTO organization);

    PageInfo<UserDTO> pagingQueryUsersInOrganization(Long organizationId,
                                                 Long userId, String email, int page, int size, String param);

    List<OrganizationDTO> queryByIds(Set<Long> ids);

    /**
     * 获取所有组织{id,name}
     *
     * @return list
     */
    PageInfo<OrganizationSimplifyDTO> getAllOrgs(int page, int size);

}
