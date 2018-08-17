package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.domain.iam.entity.Dashboard;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardMapper extends BaseMapper<Dashboard> {

    /**
     * 分页模糊查询客户端
     *
     * @param dashboard Dashboard对象
     * @param param     Dashboard模糊查询参数
     * @return Dashboard集合
     */
    List<Dashboard> fulltextSearch(
            @Param("dashboard") Dashboard dashboard,
            @Param("param") String param);

    List<Dashboard> selectByLevel(@Param("level") String level);
}
