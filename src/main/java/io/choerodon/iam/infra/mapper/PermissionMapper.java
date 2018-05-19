package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import io.choerodon.iam.infra.dataobject.PermissionDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface PermissionMapper extends BaseMapper<PermissionDO> {
    List fulltextSearch(@Param("permissionDO") PermissionDO permissionDO, @Param("params") String[] params);

    @Select(" SELECT r.role_id"
            + " FROM iam_role_permission r LEFT JOIN iam_permission p"
            + " on r.permission_id=p.id"
            + " where p.level=#{level} and p.code = #{code}")
    List<Long> queryRolesByPermission(@Param("code") String code, @Param("level") String level);

    List<PermissionDO> selectByRoleId(Long roleId);

    Set<String> checkPermission(@Param("member_id") Long memberId, @Param("source_type") String source_type,
                                 @Param("source_id") Long sourceId, @Param("codes") Set<String> codes);
}
