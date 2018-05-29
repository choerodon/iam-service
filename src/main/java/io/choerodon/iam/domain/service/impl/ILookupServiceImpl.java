package io.choerodon.iam.domain.service.impl;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.domain.iam.entity.LookupE;
import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.domain.service.ILookupService;
import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.mybatis.service.BaseServiceImpl;
import org.springframework.stereotype.Service;

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
        LookupE le = lookupRepository.insert(lookupE);
        List<LookupValueE> lookupValueEList = lookupE.getLookupValues();
        List<LookupValueE> retuenList = new ArrayList<>();
        if (lookupValueEList != null
                && !lookupValueEList.isEmpty()) {
            lookupValueEList.forEach(lve -> {
                lve.setLookupId(le.getId());
                retuenList.add(lookupValueRepository.insert(lve));
            });
        }
        le.setLookupValues(retuenList);
        return le;
    }


    @Override
    public void delete(Long id) {
        LookupE lookupE = new LookupE();
        lookupE.setId(id);
        lookupRepository.delete(lookupE);
        List<LookupValueE> lookupValueEList = lookupValueRepository.selectByLookupId(id);
        //删除lookupValue，但是多语言插件不支持批量删除，所以一个个删除
        lookupValueEList.forEach(lve ->
                lookupValueRepository.deleteById(lve.getId())
        );
    }


    @Override
    public LookupE update(LookupE lookupE) {
        LookupE le = lookupRepository.update(lookupE);
        List<LookupValueE> lookupValueEList = lookupE.getLookupValues();
        List<LookupValueE> retuenList = new ArrayList<>();
        if (lookupValueEList != null
                && !lookupValueEList.isEmpty()) {
            lookupValueEList.forEach(lve -> {
                if (lve.getId() == null) {
                    throw new CommonException("error.service.lookupValue.id.empty");
                }
                if (lve.getObjectVersionNumber() == null) {
                    throw new CommonException("error.service.lookupValue.objectVersionNumber.empty");
                }
                lve.setId(le.getId());
                if (lve.getCode() == null) {
                    throw new CommonException("error.service.lookupValue.code.empty");
                }
                retuenList.add(lookupValueRepository.update(lve));
            });
        }
        le.setLookupValues(retuenList);
        return le;
    }

    @Override
    public LookupE queryByCode(LookupE lookupE) {
        List<LookupE> lookupEList = lookupRepository.select(lookupE);
        if (lookupEList.size() != 1) {
            throw new CommonException("error.lookup.code.duplication");
        }
        LookupE le = lookupEList.get(0);
        le.setLookupValues(lookupValueRepository.selectByLookupId(le.getId()));
        return le;
    }

    @Override
    public LookupE queryById(LookupE lookupE) {
        LookupE le = lookupRepository.selectById(lookupE.getId());
        if (le == null) {
            throw new CommonException("error.service.lookup.notExist");
        }
        le.setLookupValues(lookupValueRepository.selectByLookupId(lookupE.getId()));
        return le;
    }

}
