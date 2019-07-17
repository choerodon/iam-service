package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.app.service.LookupService;
import io.choerodon.iam.infra.asserts.AssertHelper;
import io.choerodon.iam.infra.dto.LookupDTO;
import io.choerodon.iam.infra.dto.LookupValueDTO;
import io.choerodon.iam.infra.exception.EmptyParamException;
import io.choerodon.iam.infra.exception.InsertException;
import io.choerodon.iam.infra.exception.UpdateExcetion;
import io.choerodon.iam.infra.mapper.LookupMapper;
import io.choerodon.iam.infra.mapper.LookupValueMapper;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.List;

/**
 * @author superlee
 */
@Service
public class LookupServiceImpl implements LookupService {

    private LookupMapper lookupMapper;

    private LookupValueMapper lookupValueMapper;

    private AssertHelper assertHelper;

    public LookupServiceImpl(LookupMapper lookupMapper,
                             LookupValueMapper lookupValueMapper,
                             AssertHelper assertHelper) {
        this.lookupMapper = lookupMapper;
        this.lookupValueMapper = lookupValueMapper;
        this.assertHelper = assertHelper;

    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public LookupDTO create(LookupDTO lookupDTO) {
        lookupDTO.setId(null);
        List<LookupValueDTO> values = lookupDTO.getLookupValues();
        if (lookupMapper.insertSelective(lookupDTO) != 1) {
            throw new InsertException("error.repo.lookup.insert");
        }
        if (!ObjectUtils.isEmpty(values)) {
            values.forEach(v -> {
                v.setId(null);
                v.setLookupId(lookupDTO.getId());
                if (lookupValueMapper.insertSelective(v) != 1) {
                    throw new InsertException("error.lookupValue.insert");
                }
            });
        }
        return lookupDTO;
    }

    @Override
    public PageInfo<LookupDTO> pagingQuery(PageRequest pageRequest, LookupDTO lookupDTO, String param) {
        return PageHelper
                .startPage(pageRequest.getPage(), pageRequest.getSize())
                .doSelectPageInfo(() -> lookupMapper.fulltextSearch(lookupDTO, param));
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void delete(Long id) {
        lookupMapper.deleteByPrimaryKey(id);
        //删除lookup级联删除lookupValue
        LookupValueDTO lookupValue = new LookupValueDTO();
        lookupValue.setLookupId(id);
        lookupValueMapper.delete(lookupValue);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public LookupDTO update(LookupDTO lookupDTO) {
        assertHelper.objectVersionNumberNotNull(lookupDTO.getObjectVersionNumber());
        List<LookupValueDTO> values = lookupDTO.getLookupValues();
        if (lookupMapper.updateByPrimaryKeySelective(lookupDTO) != 1) {
            throw new UpdateExcetion("error.repo.lookup.update");
        }

        LookupValueDTO dto = new LookupValueDTO();
        dto.setLookupId(lookupDTO.getId());
        List<LookupValueDTO> list = lookupValueMapper.select(dto);

        if (!ObjectUtils.isEmpty(values)) {
            values.forEach(v -> {
                if (v.getId() == null) {
                    throw new EmptyParamException("error.lookupValue.id.null");
                }
                list.forEach(d -> {
                    if (d.getId().equals(v.getId())) {
                        d.setCode(v.getCode());
                        d.setDescription(v.getDescription());
                        lookupValueMapper.updateByPrimaryKeySelective(d);
                    }
                });

            });
        }
        return lookupDTO;
    }

    @Override
    public LookupDTO queryById(Long id) {
        LookupDTO lookup = lookupMapper.selectByPrimaryKey(id);
        if (lookup == null) {
            return null;
        }
        LookupValueDTO lookupValue = new LookupValueDTO();
        lookupValue.setLookupId(id);
        lookup.setLookupValues(lookupValueMapper.select(lookupValue));
        return lookup;
    }

    @Override
    public LookupDTO listByCodeWithLookupValues(String code) {
        return lookupMapper.selectByCodeWithLookupValues(code);
    }
}
