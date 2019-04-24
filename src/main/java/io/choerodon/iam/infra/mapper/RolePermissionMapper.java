package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.RolePermissionDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author wuguokai
 */
public interface RolePermissionMapper extends Mapper<RolePermissionDTO> {

    List<Long> queryExistingPermissionIdsByRoleIds(@Param("list") List<Long> roleIds);
}
