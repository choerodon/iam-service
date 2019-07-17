package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.api.dto.OrgSharesDTO;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.UserDTO;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface OrganizationService {

    OrganizationDTO updateOrganization(Long organizationId, OrganizationDTO organizationDTO, String level, Long sourceId);

    OrganizationDTO queryOrganizationById(Long organizationId);

    OrganizationDTO queryOrganizationWithRoleById(Long organizationId);

    PageInfo<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, PageRequest pageRequest, String param);

    OrganizationDTO enableOrganization(Long organizationId, Long userId);

    OrganizationDTO disableOrganization(Long organizationId, Long userId);

    void check(OrganizationDTO organization);

    PageInfo<UserDTO> pagingQueryUsersInOrganization(Long organizationId,
                                                 Long userId, String email, PageRequest pageRequest, String param);

    List<OrganizationDTO> queryByIds(Set<Long> ids);

    /**
     * 获取所有组织{id,name}
     *
     * @return list
     */
    PageInfo<OrganizationSimplifyDTO> getAllOrgs(PageRequest pageRequest);


    /**
     * 分页获取 指定id范围 的 组织简要信息
     *
     * @param orgIds      指定的组织范围
     * @param name        组织名查询参数
     * @param code        组织编码查询参数
     * @param enabled     组织启停用查询参数
     * @param params      全局模糊搜索查询参数
     * @param pageRequest 分页参数
     * @return 分页结果
     */
    PageInfo<OrgSharesDTO> pagingSpecified(Set<Long> orgIds, String name, String code, Boolean enabled, String params, PageRequest pageRequest);
}
