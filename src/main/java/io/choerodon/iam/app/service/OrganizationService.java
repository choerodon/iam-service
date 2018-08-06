package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.OrganizationDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface OrganizationService {

    OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO);

    OrganizationDTO queryOrganizationById(Long organizationId);

    Page<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param);

    OrganizationDTO enableOrganization(Long organizationId);

    OrganizationDTO disableOrganization(Long organizationId);

    void check(OrganizationDTO organization);

}
