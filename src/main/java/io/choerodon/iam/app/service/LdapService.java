package io.choerodon.iam.app.service;

import io.choerodon.iam.api.dto.LdapAccountDTO;
import io.choerodon.iam.api.dto.LdapConnectionDTO;
import io.choerodon.iam.api.dto.LdapDTO;
import io.choerodon.iam.api.dto.UserDTO;

/**
 * @author wuguokai
 */
public interface LdapService {
    LdapDTO create(Long organizationId, LdapDTO ldapDTO);

    LdapDTO update(Long organizationId, Long id, LdapDTO ldapDTO);

    LdapDTO queryByOrganizationId(Long organizationId);

    Boolean delete(Long organizationId, Long id);

    /**
     * 测试是否能连接到ldap
     * @param organizationId 组织id
     * @param id             ldapId
     * @return LdapConnectionDTO 连接测试结构体
     */
    LdapConnectionDTO testConnect(Long organizationId, Long id, LdapAccountDTO ldapAccountDTO);

    void syncLdapUser(Long organizationId, UserDTO userDTO);
}
