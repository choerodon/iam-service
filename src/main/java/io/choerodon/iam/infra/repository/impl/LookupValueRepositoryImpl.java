package io.choerodon.iam.infra.repository.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.infra.dataobject.LookupValueDO;
import io.choerodon.iam.infra.mapper.LookupValueMapper;

/**
 * @author superlee
 */
@Component
public class LookupValueRepositoryImpl implements LookupValueRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(LookupValueRepositoryImpl.class);

    private LookupValueMapper mapper;

    public LookupValueRepositoryImpl(LookupValueMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public LookupValueE insert(LookupValueE lookupValueE) {
        LookupValueDO lookupValueDO = ConvertHelper.convert(lookupValueE, LookupValueDO.class);
        if (mapper.insertSelective(lookupValueDO) != 1) {
            LOGGER.debug("insert lookup value fail:{}", lookupValueDO);
            throw new CommonException("error.repo.lookupValue.insert");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(lookupValueDO.getId()), LookupValueE.class);
    }

    @Override
    public List<LookupValueE> selectByLookupId(Long id) {
        LookupValueDO lookupValueDO = new LookupValueDO();
        lookupValueDO.setLookupId(id);
        return ConvertHelper.convertList(mapper.select(lookupValueDO), LookupValueE.class);
    }

    @Override
    public void deleteById(Long id) {
        if (mapper.deleteByPrimaryKey(id) != 1) {
            throw new CommonException("error.repo.lookupValue.delete");
        }
    }

    @Override
    public LookupValueE update(LookupValueE lookupValueE) {
        LookupValueDO lookupValueDO = ConvertHelper.convert(lookupValueE, LookupValueDO.class);
        if (mapper.selectOne(lookupValueDO) == null) {
            throw new CommonException("error.repo.lookupValue.notExist");
        }
        if (mapper.updateByPrimaryKeySelective(lookupValueDO) != 1) {
            LOGGER.debug("update lookup value fail:{}", lookupValueDO);
            throw new CommonException("error.repo.lookupValue.update");
        }
        return ConvertHelper.convert(mapper.selectByPrimaryKey(lookupValueDO.getId()), LookupValueE.class);
    }

    @Override
    public void delete(LookupValueDO lookupValue) {
        mapper.delete(lookupValue);
    }
}
