package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.convertor.ConvertHelper;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.LookupE;
import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.domain.service.ILookupService;
import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.iam.infra.dataobject.LookupValueDO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @author superlee
 */
@Service
public class ILookupServiceImpl extends BaseServiceImpl<LookupDO> implements ILookupService {

    private LookupRepository lookupRepository;

    private LookupValueRepository lookupValueRepository;

    public ILookupServiceImpl(LookupRepository lookupRepository, LookupValueRepository lookupValueRepository) {
        this.lookupRepository = lookupRepository;
        this.lookupValueRepository = lookupValueRepository;
    }

    @Override
    public LookupE create(LookupE lookupE) {
        lookupE.setId(null);
        lookupE.setObjectVersionNumber(null);
        LookupE le = lookupRepository.insert(lookupE);
        List<LookupValueE> lookupValueEList = lookupE.getLookupValues();
        List<LookupValueE> returnList = new ArrayList<>();
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
        LookupE lookupE = new LookupE();
        lookupE.setId(id);
        lookupRepository.delete(lookupE);
        List<LookupValueDO> lookupValueDOS = lookupValueRepository.selectByLookupId(id);
        //删除lookupValue，但是多语言插件不支持批量删除，所以一个个删除
        lookupValueDOS.forEach(lve ->
                lookupValueRepository.deleteById(lve.getId())
        );
    }

    @Override
    @Transactional
    public LookupE update(LookupE lookupE) {
        LookupE le = lookupRepository.update(lookupE, lookupE.getId());
        List<LookupValueE> lookupValueEList = lookupE.getLookupValues();
        List<LookupValueE> returnList = new ArrayList<>();
        if (lookupValueEList != null && !lookupValueEList.isEmpty()) {
            List<LookupValueDO> lookupValueDOS = lookupValueRepository.selectByLookupId(le.getId());
            lookupValueEList.forEach(lve -> {
                if (lve.getId() == null) {
                    throw new CommonException("error.lookupValue.id.null");
                }
                for (LookupValueDO lookupValueDO : lookupValueDOS) {
                    if (lookupValueDO.getId().equals(lve.getId())) {
                        lookupValueDO.setCode(lve.getCode());
                        lookupValueDO.setDescription(lve.getDescription());
                        returnList.add(lookupValueRepository.updateById(lookupValueDO, lve.getId()));
                    }
                }
            });
        }
        le.setLookupValues(returnList);
        return le;
    }

    @Override
    public LookupE queryByCode(LookupE lookupE) {
        List<LookupE> lookupEList = lookupRepository.select(lookupE);
        if (lookupEList.size() != 1) {
            throw new CommonException("error.lookup.code.duplication");
        }
        LookupE le = lookupEList.get(0);
        le.setLookupValues(ConvertHelper.convertList(lookupValueRepository.selectByLookupId(le.getId()), LookupValueE.class));
        return le;
    }

    @Override
    public LookupE queryById(LookupE lookupE) {
        LookupE le = lookupRepository.selectById(lookupE.getId());
        if (le == null) {
            throw new CommonException("error.lookup.not.exist", lookupE.getId());
        }
        le.setLookupValues(ConvertHelper.convertList(lookupValueRepository.selectByLookupId(le.getId()), LookupValueE.class));
        return le;
    }

}
