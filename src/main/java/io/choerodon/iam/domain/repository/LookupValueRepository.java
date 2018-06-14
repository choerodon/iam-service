package io.choerodon.iam.domain.repository;

import io.choerodon.iam.domain.iam.entity.LookupValueE;
import io.choerodon.iam.infra.dataobject.LookupValueDO;

import java.util.List;

/**
 * @author superlee
 */
public interface LookupValueRepository {

    LookupValueE insert(LookupValueE lookupValueE);

    List<LookupValueDO> selectByLookupId(Long id);

    void deleteById(Long id);

    LookupValueE updateById(LookupValueDO lookupValueDO, Long id);

    void delete(LookupValueDO lookupValue);
}
