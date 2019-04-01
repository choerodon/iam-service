package io.choerodon.iam.domain.service;

import io.choerodon.iam.domain.iam.entity.LookupE;
import io.choerodon.iam.infra.dataobject.LookupDO;
import io.choerodon.mybatis.service.BaseService;

/**
 * @author superlee
 */
public interface ILookupService extends BaseService<LookupDO> {

    LookupE create(LookupE lookupE);

    void delete(Long id);

    LookupE update(LookupE lookupE);

    LookupE queryById(LookupE lookupE);

    LookupE queryByCode(LookupE lookupE);

}
