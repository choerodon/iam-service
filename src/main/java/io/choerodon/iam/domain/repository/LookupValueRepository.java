package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.LookupValueDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupValueRepository {

    LookupValueDTO insert(LookupValueDTO lookupValueDTO);

    List<LookupValueDTO> selectByLookupId(Long id);

    void deleteById(Long id);

    LookupValueDTO updateById(LookupValueDTO lookupValueDTO, Long id);

    void delete(LookupValueDTO lookupValue);
}
