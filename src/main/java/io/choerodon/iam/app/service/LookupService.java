package io.choerodon.iam.app.service;


import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.LookupDTO;

/**
 * @author superlee
 */
public interface LookupService {

    LookupDTO create(LookupDTO lookupDTO);

    Page<LookupDTO> pagingQuery(int page,int size, LookupDTO lookupDTO, String param);

    void delete(Long id);

    LookupDTO update(LookupDTO lookupDTO);

    LookupDTO queryById(Long id);

    LookupDTO queryByCode(String code);

    LookupDTO listByCodeWithLookupValues(String code);
}
