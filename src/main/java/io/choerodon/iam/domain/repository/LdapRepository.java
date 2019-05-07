package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.LdapDTO;

/**
 * @author wuguokai
 */
public interface LdapRepository {
    LdapDTO create(LdapDTO ldapDTO);

    LdapDTO update(Long id, LdapDTO ldapDTO);

    /**
     * 根据ldap id查询ldap
     *
     * @param id 主键id
     * @return ldap data object
     */
    LdapDTO queryById(Long id);

    LdapDTO queryByOrgId(Long orgId);

    Boolean delete(Long id);
}
