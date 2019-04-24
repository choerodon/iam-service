package io.choerodon.iam.domain.service;


import io.choerodon.iam.infra.dto.LookupDTO;

/**
 * @author superlee
 */
public interface ILookupService {

    LookupDTO create(LookupDTO lookupDTO);

    void delete(Long id);

    LookupDTO update(LookupDTO lookupDTO);

    LookupDTO queryById(LookupDTO lookupDTO);

    LookupDTO queryByCode(LookupDTO lookupDTO);

}
