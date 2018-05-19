package io.choerodon.iam.domain.repository;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.infra.dataobject.IconDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 * @data 2018/04/11
 */
public interface IconRepository {

    IconDO create(IconDO iconDO);

    void delete(IconDO iconDO);

    Page<IconDO> pagingQuery(PageRequest pageRequest, String code);
}
