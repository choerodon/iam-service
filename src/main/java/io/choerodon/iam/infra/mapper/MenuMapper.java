package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.MenuDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 * @author superlee
 */
public interface MenuMapper extends BaseMapper<MenuDO> {

    List<MenuDO> queryMenusWithPermissions(@Param("level") String level, @Param("type") String type);

    List<MenuDO> queryMenusWithPermissionByTestPermission(@Param("level") String level,
                                                          @Param("memberType") String memberType, @Param("memberId") Long memberId,
                                                          @Param("sourceType") String sourceType, @Param("sourceId") Long sourceId,
                                                          @Param("category") String category);

    void deleteMenusById(@Param("menuIds") List<Long> menuIds);
}
