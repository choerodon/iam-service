package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface RoleMapper extends BaseMapper<RoleDO> {

    @Select(" SELECT role_id from iam_member_role m"
            + " left join iam_role r ON m.role_id=r.id"
            + " where member_type='user' and member_id = #{user_id}"
            + " and source_type = #{source_type} and source_id = #{source_id} and r.is_enabled = 1")
    List<Long> queryRoleByUser(@Param("user_id") Long userId, @Param("source_type") String sourceType,
                               @Param("source_id") Long sourceId);

    List<RoleDO> fulltextSearch(@Param("roleDO") RoleDO roleDO, @Param("params") String[] params);

    RoleDO selectRoleWithPermissionsAndLabels(Long id);

    int rolesLevelCount(@Param("roleIds") List<Long> roleIds);

    List<RoleDO> selectRolesByLabelNameAndType(@Param("name") String name, @Param("type") String type);
}
