package io.choerodon.iam.app.service.impl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.app.service.LookupService;
import io.choerodon.iam.domain.repository.LookupRepository;
import io.choerodon.iam.domain.repository.LookupValueRepository;
import io.choerodon.iam.domain.service.ILookupService;
import io.choerodon.iam.infra.dto.LookupDTO;
import io.choerodon.iam.infra.dto.LookupValueDTO;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author superlee
 */
@Component
public class LookupServiceImpl implements LookupService {


    private ILookupService service;

    private LookupRepository lookupRepository;

    private LookupValueRepository lookupValueRepository;

    public LookupServiceImpl(ILookupService service,
                             LookupRepository lookupRepository,
                             LookupValueRepository lookupValueRepository) {
        this.service = service;
        this.lookupRepository = lookupRepository;
        this.lookupValueRepository = lookupValueRepository;
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public LookupDTO create(LookupDTO lookupDTO) {
        return
                service.create(lookupDTO);
    }

    @Override
    public PageInfo<LookupDTO> pagingQuery(int page, int size, LookupDTO lookupDTO, String param) {
        return lookupRepository.pagingQuery(page,size,lookupDTO,param);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public void delete(Long id) {
        lookupRepository.deleteById(id);
        //删除lookup级联删除lookupValue
        LookupValueDTO lookupValue = new LookupValueDTO();
        lookupValue.setLookupId(id);
        lookupValueRepository.delete(lookupValue);
    }

    @Transactional(rollbackFor = CommonException.class)
    @Override
    public LookupDTO update(LookupDTO lookupDTO) {
        return service.update(lookupDTO);
    }

    @Override
    public LookupDTO queryById(Long id) {
        LookupDTO lookupDTO = new LookupDTO();
        lookupDTO.setId(id);
        return service.queryById(lookupDTO);
    }

    @Override
    public LookupDTO queryByCode(String code) {
        LookupDTO lookupDTO = new LookupDTO();
        lookupDTO.setCode(code);
        return service.queryByCode(lookupDTO);
    }

    @Override
    public LookupDTO listByCodeWithLookupValues(String code) {
        return lookupRepository.listByCodeWithLookupValues(code);
    }
}
