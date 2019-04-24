package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.UserDashboardDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author dongfan117@gmail.com
 */
public interface UserDashboardMapper extends Mapper<UserDashboardDTO> {

    List<UserDashboardDTO> selectWithDashboard(@Param("userDashboard") UserDashboardDTO userDashboard);

    int deleteWithDashboard(@Param("userDashboard") UserDashboardDTO userDashboard);

    List<UserDashboardDTO> selectWithDashboardNotExist(@Param("userDashboard") UserDashboardDTO userDashboard);
}
