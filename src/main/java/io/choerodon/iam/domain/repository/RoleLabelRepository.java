package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dataobject.RoleLabelDO;

import java.util.List;

/**
 * @author superlee
 */
public interface RoleLabelRepository {
    void insert(RoleLabelDO roleLabelDO);

    void insertList(List<RoleLabelDO> roleLabelDOList);

    List<RoleLabelDO> select(RoleLabelDO roleLabelDO);

    void delete(RoleLabelDO rl);
}
