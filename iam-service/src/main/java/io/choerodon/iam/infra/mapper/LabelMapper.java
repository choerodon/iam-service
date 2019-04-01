package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.LabelDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 */
public interface LabelMapper extends BaseMapper<LabelDO> {

    List<LabelDO> selectByRoleId(Long roleId);

    List<LabelDO> selectByUserId(Long id);

    Set<String> selectLabelNamesInRoleIds(List<Long> roleIds);

    List<LabelDO> listByOption(@Param("label") LabelDO label);
}
