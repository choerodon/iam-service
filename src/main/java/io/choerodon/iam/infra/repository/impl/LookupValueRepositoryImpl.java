package io.choerodon.iam.infra.repository.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.infra.dto.LookupValueDTO;
import io.choerodon.iam.infra.mapper.LookupValueMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

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
    public LookupValueDTO insert(LookupValueDTO lookupValueDTO) {
        if (mapper.insertSelective(lookupValueDTO) != 1) {
            LOGGER.debug("insert lookup value fail:{}", lookupValueDTO);
            throw new CommonException("error.lookupValue.insert");
        }
        return mapper.selectByPrimaryKey(lookupValueDTO);
    }

    @Override
    public List<LookupValueDTO> selectByLookupId(Long id) {
        LookupValueDTO lookupValueDTO = new LookupValueDTO();
        lookupValueDTO.setLookupId(id);
        return mapper.select(lookupValueDTO);
    }

    @Override
    public void deleteById(Long id) {
        if (mapper.deleteByPrimaryKey(id) != 1) {
            throw new CommonException("error.lookupValue.delete");
        }
    }

    @Override
    public LookupValueDTO updateById(LookupValueDTO lookupValueDTO, Long id) {
        if (mapper.selectByPrimaryKey(id) == null) {
            throw new CommonException("error.lookupValue.notExist");
        }
        mapper.updateByPrimaryKeySelective(lookupValueDTO);
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public void delete(LookupValueDTO lookupValue) {
        mapper.delete(lookupValue);
    }
}
