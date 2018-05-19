package io.choerodon.iam.domain.repository;

import java.util.List;

import io.choerodon.iam.infra.dataobject.RoleLabelDO;

/**
 * @author superlee
 */
public interface RoleLabelRepository {
    void insert(RoleLabelDO roleLabelDO);

    List<RoleLabelDO> select(RoleLabelDO roleLabelDO);

    void delete(RoleLabelDO rl);
}
