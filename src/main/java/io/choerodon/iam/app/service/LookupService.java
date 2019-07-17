package io.choerodon.iam.app.service;


import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.infra.dto.LookupDTO;

/**
 * @author superlee
 */
public interface LookupService {

    LookupDTO create(LookupDTO lookupDTO);

    PageInfo<LookupDTO> pagingQuery(PageRequest pageRequest, LookupDTO lookupDTO, String param);

    void delete(Long id);

    LookupDTO update(LookupDTO lookupDTO);

    LookupDTO queryById(Long id);

    LookupDTO listByCodeWithLookupValues(String code);
}
