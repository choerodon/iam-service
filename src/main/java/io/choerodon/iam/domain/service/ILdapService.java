package io.choerodon.iam.domain.service;


import io.choerodon.iam.infra.dto.LdapDTO;

import java.util.Map;

/**
 * @author superlee
 */
public interface ILdapService {
    Map<String, Object> testConnect(LdapDTO ldap);

}
