package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.oauth.entity.LdapE;
import io.choerodon.iam.infra.dataobject.LdapDO;

/**
 * @author wuguokai
 */
public interface LdapRepository {
    LdapE create(LdapE ldapE);

    LdapDO update(Long id, LdapDO ldapDO);

    /**
     * 根据ldap id查询ldap
     * @param id 主键id
     * @return ldap data object
     */
    LdapDO queryById(Long id);

    LdapDO queryByOrgId(Long orgId);

    Boolean delete(Long id);
}
