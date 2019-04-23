package io.choerodon.iam.infra.repository.impl;

import java.util.Comparator;
import java.util.List;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.iam.infra.dto.LdapHistoryDTO;
import org.springframework.stereotype.Component;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.infra.mapper.LdapHistoryMapper;

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
    public LdapHistoryDTO insertSelective(LdapHistoryDTO ldapHistory) {
        if (ldapHistoryMapper.insertSelective(ldapHistory) != 1) {
            throw new CommonException("error.ldapHistory.insert");
        }
        return ldapHistoryMapper.selectByPrimaryKey(ldapHistory);
    }

    @Override
    public LdapHistoryDTO queryLatestHistory(Long ldapId) {
        LdapHistoryDTO example = new LdapHistoryDTO();
        example.setLdapId(ldapId);
        List<LdapHistoryDTO> ldapHistoryList = ldapHistoryMapper.select(example);
        if (ldapHistoryList.isEmpty()) {
            return null;
        } else {
            ldapHistoryList.sort(Comparator.comparing(LdapHistoryDTO::getId).reversed());
            return ldapHistoryList.get(0);
        }
    }

    @Override
    public LdapHistoryDTO updateByPrimaryKeySelective(LdapHistoryDTO ldapHistoryDTO) {
        if (ldapHistoryMapper.updateByPrimaryKeySelective(ldapHistoryDTO) != 1) {
            throw new CommonException("error.ldapHistory.update");
        }
        return ldapHistoryMapper.selectByPrimaryKey(ldapHistoryDTO.getId());
    }

    @Override
    public Page<LdapHistoryDTO> pagingQuery(int page, int size, Long ldapId) {
        return PageHelper.startPage(page, size).doSelectPage(() -> ldapHistoryMapper.selectAllEnd(ldapId));
    }
}
