package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LdapRepository;
import io.choerodon.iam.infra.dto.LdapDTO;
import io.choerodon.iam.infra.mapper.LdapMapper;
import org.springframework.stereotype.Component;

/**
 * @author wuguokai
 */
@Component
public class LdapRepositoryImpl implements LdapRepository {
    private LdapMapper ldapMapper;

    public LdapRepositoryImpl(LdapMapper ldapMapper) {
        this.ldapMapper = ldapMapper;
    }

    @Override
    public LdapDTO create(LdapDTO ldapDTO) {
        if (ldapMapper.insertSelective(ldapDTO) != 1) {
            throw new CommonException("error.ldap.insert");
        }
        return ldapMapper.selectByPrimaryKey(ldapDTO);
    }

    @Override
    public LdapDTO update(Long id, LdapDTO ldap) {
        ldap.setId(id);
        if (ldapMapper.updateByPrimaryKey(ldap) != 1) {
            throw new CommonException("error.ldap.update");
        }
        return ldapMapper.selectByPrimaryKey(id);
    }

    @Override
    public LdapDTO queryById(Long id) {
        return ldapMapper.selectByPrimaryKey(id);
    }

    @Override
    public LdapDTO queryByOrgId(Long orgId) {
        LdapDTO ldapDTO = new LdapDTO();
        ldapDTO.setOrganizationId(orgId);
        return ldapMapper.selectOne(ldapDTO);
    }

    @Override
    public Boolean delete(Long id) {
        if (ldapMapper.selectByPrimaryKey(id) == null) {
            throw new CommonException("error.ldap.not.exist");
        }
        if (ldapMapper.deleteByPrimaryKey(id) != 1) {
            throw new CommonException("error.ldap.delete");
        }
        return true;
    }
}
