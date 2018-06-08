package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

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

    List selectAllOrganizationsWithEnabledProjects();
}
