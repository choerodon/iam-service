package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface OrganizationMapper extends BaseMapper<OrganizationDO> {
    List fulltextSearch(@Param("organization") OrganizationDO organization,
                        @Param("params") String[] params);

    List selectFromMemberRoleByMemberId(@Param("memberId") Long memberId,
                                        @Param("includedDisabled") Boolean includedDisabled);

    List selectOrgByUserAndPros(@Param("memberId") Long memberId,
                                        @Param("includedDisabled") Boolean includedDisabled);

    List selectAllOrganizationsWithEnabledProjects();
}
