package io.choerodon.iam.domain.service;

import io.choerodon.iam.infra.dataobject.LdapDO;

import java.util.Map;

/**
 * @author superlee
 */
public interface ILdapService {
    Map<String, Object> testConnect(LdapDO ldap);

}
