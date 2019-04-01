package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.domain.iam.entity.DashboardE;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardMapper extends BaseMapper<DashboardE> {

    /**
     * 分页模糊查询客户端
     *
     * @param dashboard Dashboard对象
     * @param param     Dashboard模糊查询参数
     * @return Dashboard集合
     */
    List<DashboardE> fulltextSearch(
            @Param("dashboard") DashboardE dashboard,
            @Param("param") String param);

    List<DashboardE> selectByLevel(@Param("level") String level);
}
