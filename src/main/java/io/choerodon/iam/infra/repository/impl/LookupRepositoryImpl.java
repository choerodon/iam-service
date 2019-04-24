package io.choerodon.iam.infra.repository.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.infra.dto.LookupDTO;
import io.choerodon.iam.infra.mapper.LookupMapper;
import org.springframework.stereotype.Component;

import java.util.List;

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
    public LookupDTO insert(LookupDTO lookupDTO) {
//        LookupDO lookupDO = ConvertHelper.convert(lookupDTO, LookupDO.class);
        if (mapper.insertSelective(lookupDTO) != 1) {
            throw new CommonException("error.repo.lookup.insert");
        }
        return
                mapper.selectByPrimaryKey(lookupDTO);
    }

    @Override
    public Page<LookupDTO> pagingQuery(int page,int size, LookupDTO lookupDTO, String param) {
        return PageHelper.startPage(page,size).doSelectPage(()->mapper.fulltextSearch(lookupDTO, param));
//        return PageHelper.doPageAndSort(pageRequest, () -> mapper.fulltextSearch(lookupDO, param));
    }

    @Override
    public void delete(LookupDTO lookupDTO) {
//        LookupDO lookupDO = ConvertHelper.convert(lookupE, LookupDO.class);
        if (mapper.delete(lookupDTO) != 1) {
            throw new CommonException("error.repo.lookup.delete");
        }
    }

    @Override
    public LookupDTO update(LookupDTO lookupDTO, Long id) {
//        LookupDO lookupDO = ConvertHelper.convert(lookupDTO, LookupDO.class);
        if (mapper.selectByPrimaryKey(id) == null) {
            throw new CommonException("error.repo.lookup.notExist");
        }
        if (mapper.updateByPrimaryKeySelective(lookupDTO) != 1) {
            throw new CommonException("error.repo.lookup.update");
        }
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public LookupDTO selectById(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    @Override
    public List<LookupDTO> select(LookupDTO lookupDTO) {
        return mapper.select(lookupDTO);
    }

    @Override
    public void deleteById(Long id) {
        LookupDTO lookup = mapper.selectByPrimaryKey(id);
        if (lookup == null) {
            throw new CommonException("error.lookup.not.exist", id);
        } else {
            mapper.deleteByPrimaryKey(id);
        }
    }

    @Override
    public LookupDTO listByCodeWithLookupValues(String code) {
        return mapper.selectByCodeWithLookupValues(code);
    }
}
