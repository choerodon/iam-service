package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.RoleLabelDTO;

import java.util.List;

/**
 * @author superlee
 */
public interface RoleLabelRepository {
    void insert(RoleLabelDTO roleLabelDTO);

    void insertList(List<RoleLabelDTO> roleLabelDOList);

    List<RoleLabelDTO> select(RoleLabelDTO roleLabelDTO);

    void delete(RoleLabelDTO rl);
}
