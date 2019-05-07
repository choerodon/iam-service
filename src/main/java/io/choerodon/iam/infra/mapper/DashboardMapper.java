package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.DashboardDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardMapper extends Mapper<DashboardDTO> {

    /**
     * 分页模糊查询客户端
     *
     * @param dashboard Dashboard对象
     * @param param     Dashboard模糊查询参数
     * @return Dashboard集合
     */
    List<DashboardDTO> fulltextSearch(
            @Param("dashboard") DashboardDTO dashboard,
            @Param("param") String param);

    List<DashboardDTO> selectByLevel(@Param("level") String level);
}
