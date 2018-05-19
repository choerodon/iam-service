package io.choerodon.iam.infra.repository.impl;

import org.springframework.stereotype.Component;

import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LanguageRepository;
import io.choerodon.iam.infra.dataobject.LanguageDO;
import io.choerodon.iam.infra.mapper.LanguageMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

import java.util.List;


/**
 * @author superlee
 */
@Component
public class LanguageRepositoryImpl implements LanguageRepository {

    private LanguageMapper mapper;

    public LanguageRepositoryImpl(LanguageMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Page<LanguageDO> pagingQuery(PageRequest pageRequest, LanguageDO languageDO, String param) {
        return PageHelper.doPageAndSort(
                pageRequest, () -> mapper.fulltextSearch(languageDO, param));
    }

    @Override
    public LanguageDO update(LanguageDO languageDO) {
        if (mapper.updateByPrimaryKeySelective(languageDO) != 1) {
            throw new CommonException("error.language.update");
        }
        return mapper.selectByPrimaryKey(languageDO.getId());
    }

    @Override
    public LanguageDO queryById(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public LanguageDO queryByCode(LanguageDO languageDO) {
        return mapper.selectOne(languageDO);
    }

    @Override
    public List<LanguageDO> listAll() {
        return mapper.selectAll();
    }
}
