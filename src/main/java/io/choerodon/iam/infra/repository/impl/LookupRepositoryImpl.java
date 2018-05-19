package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.domain.Page;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.LookupE;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.iam.infra.mapper.LookupMapper;
import io.choerodon.mybatis.pagehelper.PageHelper;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 */
@Component
public class LookupRepositoryImpl implements LookupRepository {

    private LookupMapper mapper;

    public LookupRepositoryImpl(LookupMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public LookupE insert(LookupE lookupE) {
        LookupDO lookupDO = ConvertHelper.convert(lookupE, LookupDO.class);
        if (mapper.insertSelective(lookupDO) != 1) {
            throw new CommonException("error.repo.lookup.insert");
        }
        return ConvertHelper.convert(
                mapper.selectByPrimaryKey(lookupDO.getId()), LookupE.class);
    }

    @Override
    public Page<LookupDO> pagingQuery(PageRequest pageRequest, LookupDO lookupDO, String param) {
        return PageHelper.doPageAndSort(pageRequest, () -> mapper.fulltextSearch(lookupDO, param));
    }

    @Override
    public void delete(LookupE lookupE) {
        LookupDO lookupDO = ConvertHelper.convert(lookupE, LookupDO.class);
        if (mapper.delete(lookupDO) != 1) {
            throw new CommonException("error.repo.lookup.delete");
        }
    }

    @Override
    public LookupE update(LookupE lookupE) {
        LookupDO lookupDO = ConvertHelper.convert(lookupE, LookupDO.class);
        if (mapper.selectOne(lookupDO) == null) {
            throw new CommonException("error.repo.lookup.notExist");
        }
        if (mapper.updateByPrimaryKeySelective(lookupDO) != 1) {
            throw new CommonException("error.repo.lookup.update");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(lookupDO.getId()), LookupE.class);
    }

    @Override
    public LookupE selectById(Long id) {
        return ConvertHelper.convert(mapper.selectByPrimaryKey(id), LookupE.class);
    }

    @Override
    public List<LookupE> select(LookupE lookupE) {
        return ConvertHelper.convertList(mapper.select(ConvertHelper.convert(lookupE, LookupDO.class)), LookupE.class);
    }

    @Override
    public void deleteById(Long id) {
        LookupDO lookup = mapper.selectByPrimaryKey(id);
        if (lookup == null) {
            throw new CommonException("error.lookup.not.exist", id);
        } else {
            mapper.deleteByPrimaryKey(id);
        }
    }

    @Override
    public LookupDO listByCodeWithLookupValues(String code) {
        return mapper.selectByCodeWithLookupValues(code);
    }
}
