package io.choerodon.iam.domain.service;

import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.infra.dataobject.LdapDO;

/**
 * @author superlee
 */
public interface ILdapService {
    LdapConnectionDTO testConnect(LdapDO ldap);
}
