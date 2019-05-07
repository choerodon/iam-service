package io.choerodon.iam.domain.repository;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;

/**
 * @author superlee
 */
public interface LdapHistoryRepository {
    LdapHistoryDTO insertSelective(LdapHistoryDTO ldapHistory);

    LdapHistoryDTO queryLatestHistory(Long ldapId);

    LdapHistoryDTO updateByPrimaryKeySelective(LdapHistoryDTO ldapHistoryDTO);

    PageInfo<LdapHistoryDTO> pagingQuery(int page, int size, Long ldapId);
}
