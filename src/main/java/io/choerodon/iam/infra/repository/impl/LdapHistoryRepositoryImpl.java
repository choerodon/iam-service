package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.mapper.LdapHistoryMapper;
import org.springframework.stereotype.Component;

/**
 * @author superlee
 */
@Component
public class LdapHistoryRepositoryImpl implements LdapHistoryRepository {

    private LdapHistoryMapper ldapHistoryMapper;

    public LdapHistoryRepositoryImpl(LdapHistoryMapper ldapHistoryMapper) {
        this.ldapHistoryMapper = ldapHistoryMapper;
    }

    @Override
    public LdapHistoryDO insertSelective(LdapHistoryDO ldapHistory) {
        if (ldapHistoryMapper.insertSelective(ldapHistory) != 1) {
            throw new CommonException("error.ldapHistory.insert");
        }
        return ldapHistoryMapper.selectByPrimaryKey(ldapHistory.getId());
    }

    @Override
    public LdapHistoryDO queryLatestHistory(Long id) {
        return ldapHistoryMapper.queryLatestHistory(id);
    }

    @Override
    public LdapHistoryDO updateByPrimaryKeySelective(LdapHistoryDO ldapHistoryDO) {
        if (ldapHistoryMapper.updateByPrimaryKeySelective(ldapHistoryDO) != 1) {
            throw new CommonException("error.ldapHistory.update");
        }
        return ldapHistoryMapper.selectByPrimaryKey(ldapHistoryDO.getId());
    }
}
