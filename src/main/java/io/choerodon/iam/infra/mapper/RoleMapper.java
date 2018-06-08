package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.RoleDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

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

    List<RoleDO> fulltextSearch(@Param("roleDO") RoleDO roleDO, @Param("param") String param);

    RoleDO selectRoleWithPermissionsAndLabels(Long id);

    int rolesLevelCount(@Param("roleIds") List<Long> roleIds);

    List<RoleDO> selectRolesByLabelNameAndType(@Param("name") String name, @Param("type") String type);
}
