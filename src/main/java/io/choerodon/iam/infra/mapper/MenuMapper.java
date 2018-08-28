package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.MenuDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author wuguokai
 * @author superlee
 */
public interface MenuMapper extends BaseMapper<MenuDO> {

    List<MenuDO> queryMenusWithPermissions(@Param("level") String level, @Param("type") String type);

    List<MenuDO> queryMenusWithPermissionByTestPermission(@Param("level") String level,
                                                          @Param("memberType") String memberType, @Param("memberId") Long memberId,
                                                          @Param("sourceType") String sourceType, @Param("sourceId") Long sourceId);

    void deleteMenusById(@Param("menuIds") List<Long> menuIds);
}
