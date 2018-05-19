package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.UserDTO;

/**
 * @author wuguokai
 */
public interface LdapService {
    LdapDTO create(Long orgId, LdapDTO ldapDTO);

    LdapDTO update(Long orgId, Long id, LdapDTO ldapDTO);

    LdapDTO queryByOrgId(Long orgId);

    Boolean delete(Long orgId, Long id);

    Boolean testConnect(Long orgId);

    void syncLdapUser(Long orgId, UserDTO userDTO);
}
