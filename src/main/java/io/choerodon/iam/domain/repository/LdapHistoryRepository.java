package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dataobject.LdapHistoryDO;

/**
 * @author superlee
 */
public interface LdapHistoryRepository {
    LdapHistoryDO insertSelective(LdapHistoryDO ldapHistory);

    LdapHistoryDO queryLatestHistory(Long id);

    LdapHistoryDO updateByPrimaryKeySelective(LdapHistoryDO ldapHistoryDO);
}
