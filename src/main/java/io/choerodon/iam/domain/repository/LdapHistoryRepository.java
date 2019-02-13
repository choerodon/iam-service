package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.LdapHistoryDTO;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 */
public interface LdapHistoryRepository {
    LdapHistoryDO insertSelective(LdapHistoryDO ldapHistory);

    LdapHistoryDO queryLatestHistory(Long ldapId);

    LdapHistoryDO updateByPrimaryKeySelective(LdapHistoryDO ldapHistoryDO);

    Page<LdapHistoryDTO> pagingQuery(PageRequest pageRequest, Long ldapId);
}
