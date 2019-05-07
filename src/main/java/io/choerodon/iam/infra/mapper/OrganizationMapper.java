package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;

/**
 * @author wuguokai
 */
public interface OrganizationMapper extends Mapper<OrganizationDTO> {

    List<OrganizationDTO> fulltextSearch(@Param("organization") OrganizationDTO organization,
                        @Param("param") String param);

    List<OrganizationDTO> selectFromMemberRoleByMemberId(@Param("memberId") Long memberId,
                                        @Param("includedDisabled") Boolean includedDisabled);

    List<OrganizationDTO> selectOrgByUserAndPros(@Param("memberId") Long memberId,
                                @Param("includedDisabled") Boolean includedDisabled);

    List<OrganizationDTO> selectAllWithEnabledProjects();

    List<OrganizationDTO> selectOrganizationsWithRoles(
            @Param("id") Long id,
            @Param("start") Integer start,
            @Param("size") Integer size,
            @Param("params") String params);

    List<OrganizationDTO> selectOrganizationsByUserId(@Param("userId") Long userId,
                                                     @Param("organizationDTO") OrganizationDTO organizationDTO,
                                                     @Param("params") String params);

    List<Long> listMemberIds(@Param("orgId") Long orgId,
                             @Param("orgName") String orgName);


    Boolean organizationEnabled(@Param("sourceId") Long sourceId);

    List<OrganizationDTO> selectByIds(@Param("ids") Set<Long> ids);

    /**
     * 获取所有组织{id,name}
     *
     * @return 组织{id,name}
     */
    List<OrganizationSimplifyDTO> selectAllOrgIdAndName();

}
