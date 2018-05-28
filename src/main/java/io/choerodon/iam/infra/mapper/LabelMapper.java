package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author superlee
 */
public interface LabelMapper extends BaseMapper<LabelDO> {
    List<LabelDO> selectByRoleId(Long roleId);

    List<LabelDO> selectByUserId(Long id);
}
