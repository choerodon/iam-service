package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.domain.iam.entity.DashboardRoleE;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardRoleMapper extends BaseMapper<DashboardRoleE> {

    void insertWithRoleId(@Param("dashboardId") Long dashboardId,
                          @Param("roleId") Long roleId,
                          @Param("level") String level);

    List<Long> selectRoleIds(@Param("dashboardId") Long dashboardId);

    void deleteByDashboardId(@Param("dashboardId") Long dashboardId);

    List<Long> selectDashboardByUserId(@Param("userId") Long userId,
                                       @Param("sourceId") Long sourceId,
                                       @Param("level") String level);
}
