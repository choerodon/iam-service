package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.domain.iam.entity.OrganizationE;
import io.choerodon.iam.infra.dataobject.OrganizationDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author wuguokai
 */
public interface OrganizationRepository {

    OrganizationE create(OrganizationE organizationE);

    OrganizationE update(OrganizationE organizationE);

    OrganizationDO selectByPrimaryKey(Long organizationId);

    Boolean deleteByKey(Long organizationId);

    Page<OrganizationDO> pagingQuery(OrganizationDO organizationDO, PageRequest pageRequest, String[] params);

    List<OrganizationDO> selectFromMemberRoleByMemberId(Long userId, Boolean includedDisabled);

    List<OrganizationDO> selectOrgByUserAndPros(Long userId, Boolean includedDisabled);

    List<OrganizationDO> selectAll();

    List<OrganizationDO> selectAllOrganizationsWithEnabledProjects();

    List<OrganizationDO> select(OrganizationDO organizationDO);

    OrganizationDO selectOne(OrganizationDO organizationDO);
}
