package io.choerodon.iam.domain.repository;


import com.github.pagehelper.Page;
import io.choerodon.iam.infra.dto.LookupDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupRepository {

    LookupDTO insert(LookupDTO lookupDTO);

    Page<LookupDTO> pagingQuery(int page, int size, LookupDTO lookupDTO, String param);

    void delete(LookupDTO lookupDTO);

    LookupDTO update(LookupDTO lookupDTO, Long id);

    LookupDTO selectById(Long id);

    List<LookupDTO> select(LookupDTO lookupDTO);

    void deleteById(Long id);

    LookupDTO listByCodeWithLookupValues(String code);
}
