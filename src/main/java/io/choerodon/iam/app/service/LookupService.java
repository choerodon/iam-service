package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.LookupDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 */
public interface LookupService {
    LookupDTO create(LookupDTO lookupDTO);

    Page<LookupDTO> pagingQuery(PageRequest pageRequest, LookupDTO lookupDTO);

    void delete(Long id);

    LookupDTO update(LookupDTO lookupDTO);

    LookupDTO queryById(Long id);

    LookupDTO queryByCode(String code);

    LookupDTO listByCodeWithLookupValues(String code);
}
