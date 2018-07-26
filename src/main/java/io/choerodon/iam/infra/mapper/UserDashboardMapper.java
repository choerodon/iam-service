package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.UserDashboardDTO;
import io.choerodon.iam.domain.iam.entity.UserDashboard;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author dongfan117@gmail.com
 */
public interface UserDashboardMapper extends BaseMapper<UserDashboard> {
    List<UserDashboardDTO> selectWithDashboard(@Param("userDashboard") UserDashboard userDashboard);
}
