package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.convertor.ConvertPageHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.dto.LdapHistoryDTO;
import io.choerodon.iam.domain.repository.LdapHistoryRepository;
import io.choerodon.iam.infra.dataobject.LdapHistoryDO;
import io.choerodon.iam.infra.mapper.LdapHistoryMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

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
    public LdapHistoryDO queryLatestHistory(Long ldapId) {
        LdapHistoryDO example = new LdapHistoryDO();
        example.setLdapId(ldapId);
        List<LdapHistoryDO> ldapHistoryList = ldapHistoryMapper.select(example);
        if (ldapHistoryList.isEmpty()) {
            return null;
        } else {
            ldapHistoryList.sort(Comparator.comparing(LdapHistoryDO::getId).reversed());
            return ldapHistoryList.get(0);
        }
    }

    @Override
    public LdapHistoryDO updateByPrimaryKeySelective(LdapHistoryDO ldapHistoryDO) {
        if (ldapHistoryMapper.updateByPrimaryKeySelective(ldapHistoryDO) != 1) {
            throw new CommonException("error.ldapHistory.update");
        }
        return ldapHistoryMapper.selectByPrimaryKey(ldapHistoryDO.getId());
    }

    @Override
    public Page<LdapHistoryDTO> pagingQuery(PageRequest pageRequest, Long ldapId) {
        LdapHistoryDO example = new LdapHistoryDO();
        example.setLdapId(ldapId);
        return ConvertPageHelper.convertPage(
                PageHelper.doPageAndSort(pageRequest, () -> ldapHistoryMapper.select(example)), LdapHistoryDTO.class);
    }
}
