package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.api.dto.OrgSharesDTO;
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
