package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.infra.dataobject.LookupValueDO;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupValueRepository {

    LookupValueE insert(LookupValueE lookupValueE);

    List<LookupValueE> selectByLookupId(Long id);

    void deleteById(Long id);

    LookupValueE update(LookupValueE lve);

    void delete(LookupValueDO lookupValue);
}
