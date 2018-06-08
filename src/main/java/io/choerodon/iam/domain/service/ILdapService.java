package io.choerodon.iam.domain.service;

import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.infra.dataobject.LdapDO;

import javax.naming.ldap.LdapContext;

/**
 * @author superlee
 */
public interface ILdapService {
    LdapConnectionDTO testConnect(LdapDO ldap);

    void matchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                               LdapDO ldap);

    void anonymousUserMatchAttributeTesting(LdapContext ldapContext, LdapConnectionDTO ldapConnectionDTO,
                                            LdapDO ldap);
}
