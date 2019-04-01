package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.OrganizationSimplifyDTO;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface OrganizationMapper extends BaseMapper<OrganizationDO> {

    List fulltextSearch(@Param("organization") OrganizationDO organization,
                        @Param("param") String param);

    List selectFromMemberRoleByMemberId(@Param("memberId") Long memberId,
                                        @Param("includedDisabled") Boolean includedDisabled);

    List selectOrgByUserAndPros(@Param("memberId") Long memberId,
                                @Param("includedDisabled") Boolean includedDisabled);

    List selectAllWithEnabledProjects();

    List<OrganizationDO> selectOrganizationsWithRoles(
            @Param("id") Long id,
            @Param("start") Integer start,
            @Param("size") Integer size,
            @Param("params") String params);

    List<OrganizationDO> selectOrganizationsByUserId(@Param("userId") Long userId,
                                                     @Param("organizationDO") OrganizationDO organizationDO,
                                                     @Param("params") String params);

    List<Long> listMemberIds(@Param("orgId") Long orgId,
                             @Param("orgName") String orgName);


    Boolean organizationEnabled(@Param("sourceId") Long sourceId);

    List<OrganizationDO> selectByIds(@Param("ids") Set<Long> ids);

    /**
     * 获取所有组织{id,name}
     *
     * @return 组织{id,name}
     */
    List<OrganizationSimplifyDTO> selectAllOrgIdAndName();

}
