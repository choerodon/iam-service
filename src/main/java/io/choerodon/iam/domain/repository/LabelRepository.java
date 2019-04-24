package io.choerodon.iam.domain.repository;


import io.choerodon.iam.infra.dto.LabelDTO;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 */
public interface LabelRepository {

    List<LabelDTO> listByOption(LabelDTO labelDTO);

    LabelDTO selectByPrimaryKey(Long labelId);

    List<LabelDTO> selectByRoleId(Long roleId);

    LabelDTO selectOne(LabelDTO labelDTO);

    /**
     * 根据用户id查询用户角色所有的label.name
     *
     * @param id userId
     * @return List<LabelDO> labelDos
     */
    List<LabelDTO> selectByUserId(Long id);

    Set<String> selectLabelNamesInRoleIds(List<Long> roleIds);
}
