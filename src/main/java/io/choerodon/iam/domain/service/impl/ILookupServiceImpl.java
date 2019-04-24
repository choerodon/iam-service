package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.domain.service.ILookupService;
import io.choerodon.iam.infra.dto.LookupDTO;
import io.choerodon.iam.infra.dto.LookupValueDTO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author superlee
 */
@Service
public class ILookupServiceImpl extends BaseServiceImpl<LookupDTO> implements ILookupService {

    private LookupRepository lookupRepository;

    private LookupValueRepository lookupValueRepository;

    public ILookupServiceImpl(LookupRepository lookupRepository, LookupValueRepository lookupValueRepository) {
        this.lookupRepository = lookupRepository;
        this.lookupValueRepository = lookupValueRepository;
    }

    @Override
    public LookupDTO create(LookupDTO lookupDTO) {
        lookupDTO.setId(null);
        lookupDTO.setObjectVersionNumber(null);
        LookupDTO le = lookupRepository.insert(lookupDTO);
        List<LookupValueDTO> lookupValueEList = lookupDTO.getLookupValues();
        List<LookupValueDTO> returnList = new ArrayList<>();
        if (lookupValueEList != null
                && !lookupValueEList.isEmpty()) {
            lookupValueEList.forEach(lve -> {
                lve.setId(null);
                lve.setObjectVersionNumber(null);
                lve.setLookupId(le.getId());
                returnList.add(lookupValueRepository.insert(lve));
            });
        }
        le.setLookupValues(returnList);
        return le;
    }

    @Override
    public void delete(Long id) {
        LookupDTO lookup = new LookupDTO();
        lookup.setId(id);
        lookupRepository.delete(lookup);
        List<LookupValueDTO> lookupValues = lookupValueRepository.selectByLookupId(id);
        //删除lookupValue，但是多语言插件不支持批量删除，所以一个个删除
        lookupValues.forEach(lve ->
                lookupValueRepository.deleteById(lve.getId())
        );
    }

    @Override
    @Transactional
    public LookupDTO update(LookupDTO lookup) {
        LookupDTO le = lookupRepository.update(lookup, lookup.getId());
        List<LookupValueDTO> lookupValueEList = lookup.getLookupValues();
        List<LookupValueDTO> returnList = new ArrayList<>();
        if (lookupValueEList != null && !lookupValueEList.isEmpty()) {
            List<LookupValueDTO> lookupValues = lookupValueRepository.selectByLookupId(le.getId());
            lookupValueEList.forEach(lve -> {
                if (lve.getId() == null) {
                    throw new CommonException("error.lookupValue.id.null");
                }
                for (LookupValueDTO dto : lookupValues) {
                    if (dto.getId().equals(lve.getId())) {
                        dto.setCode(lve.getCode());
                        dto.setDescription(lve.getDescription());
                        returnList.add(lookupValueRepository.updateById(dto, lve.getId()));
                    }
                }
            });
        }
        le.setLookupValues(returnList);
        return le;
    }

    @Override
    public LookupDTO queryByCode(LookupDTO lookup) {
        List<LookupDTO> lookupEList = lookupRepository.select(lookup);
        if (lookupEList.size() != 1) {
            throw new CommonException("error.lookup.code.duplication");
        }
        LookupDTO le = lookupEList.get(0);
        le.setLookupValues(lookupValueRepository.selectByLookupId(le.getId()));
        return le;
    }

    @Override
    public LookupDTO queryById(LookupDTO lookup) {
        LookupDTO le = lookupRepository.selectById(lookup.getId());
        if (le == null) {
            throw new CommonException("error.lookup.not.exist", lookup.getId());
        }
        le.setLookupValues(lookupValueRepository.selectByLookupId(le.getId()));
        return le;
    }

}
