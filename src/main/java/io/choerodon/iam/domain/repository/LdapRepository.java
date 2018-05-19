package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.oauth.entity.LdapE;

/**
 * @author wuguokai
 */
public interface LdapRepository {
    LdapE create(LdapE ldapE);

    LdapE update(Long id, LdapE ldapE);

    LdapE query(Long id);

    LdapE queryByOrgId(Long orgId);

    Boolean delete(Long id);
}
