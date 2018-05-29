package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.GroupDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author wuguokai
 */
public interface GroupMapper extends BaseMapper<GroupDO> {

    List selectGroup(@Param("organizationId") Long organizationId,
                     @Param("groupDO") GroupDO groupDO);

    List<String> selectGroupsByUser(@Param("userId") Long userId);
}
