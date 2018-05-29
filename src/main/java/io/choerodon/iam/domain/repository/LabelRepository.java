package io.choerodon.iam.domain.repository;

import io.choerodon.iam.infra.dataobject.LabelDO;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 */
public interface LabelRepository {

    List<LabelDO> listByType(String type);

    LabelDO selectByPrimaryKey(Long labelId);

    List<LabelDO> selectByRoleId(Long roleId);

    LabelDO selectOne(LabelDO labelDO);

    /**
     * 根据用户id查询用户角色所有的label.name
     *
     * @param id userId
     * @return List<LabelDO> labelDos
     */
    List<LabelDO> selectByUserId(Long id);

    Set<String> selectLabelNamesInRoleIds(List<Long> roleIds);
}
