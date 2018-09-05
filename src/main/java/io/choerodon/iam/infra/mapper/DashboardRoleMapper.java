package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.DashboardRoleDTO;
import io.choerodon.iam.domain.iam.entity.DashboardE;
import io.choerodon.iam.domain.iam.entity.DashboardRoleE;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author dongfan117@gmail.com
 */
public interface DashboardRoleMapper extends BaseMapper<DashboardRoleE> {

    /**
     * 分页模糊查询客户端
     *
     * @param dashboard Dashboard对象
     * @return Dashboard 角色集合
     */
    List<DashboardRoleDTO> query(@Param("dashboard") DashboardE dashboard);
}
