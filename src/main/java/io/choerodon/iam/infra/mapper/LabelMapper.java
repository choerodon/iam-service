package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.LabelDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;

/**
 * @author superlee
 */
public interface LabelMapper extends Mapper<LabelDTO> {

    List<LabelDTO> selectByRoleId(Long roleId);

    List<LabelDTO> selectByUserId(Long id);

    Set<String> selectLabelNamesInRoleIds(List<Long> roleIds);

    List<LabelDTO> listByOption(@Param("label") LabelDTO label);
}
