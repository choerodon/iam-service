package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.infra.dto.OrganizationDTO;

import java.util.List;
import java.util.Set;

/**
 * @author wuguokai
 */
public interface OrganizationRepository {

    OrganizationDTO create(OrganizationDTO organizationDTO);

    OrganizationDTO update(OrganizationDTO organizationDTO);

    OrganizationDTO selectByPrimaryKey(Long organizationId);

    Boolean deleteByKey(Long organizationId);

    PageInfo<OrganizationDTO> pagingQuery(OrganizationDTO organizationDTO, int page, int size, String param);

    List<OrganizationDTO> selectFromMemberRoleByMemberId(Long userId, Boolean includedDisabled);

    List<OrganizationDTO> selectOrgByUserAndPros(Long userId, Boolean includedDisabled);

    List<OrganizationDTO> selectAll();

    List<OrganizationDTO> selectAllOrganizationsWithEnabledProjects();

    List<OrganizationDTO> select(OrganizationDTO organizationDTO);

    OrganizationDTO selectOne(OrganizationDTO organizationDTO);

    PageInfo<OrganizationDTO> pagingQueryOrganizationAndRoleById(int page, int size, Long id, String params);

    PageInfo<OrganizationDTO> pagingQueryByUserId(Long userId, OrganizationDTO organizationDTO, int page,int size, String param);

    List<Long> listMemberIds(Long organizationId);

    List<OrganizationDTO> queryByIds(Set<Long> ids);

    /**
     * 查询所有组织的ID/Name
     *
     * @return list
     */
    PageInfo<OrganizationSimplifyDTO> selectAllOrgIdAndName(int page, int size);
}
