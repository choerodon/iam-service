package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.MenuDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * @author wuguokai
 * @author superlee
 */
public interface MenuMapper extends Mapper<MenuDTO> {

    List<MenuDTO> queryProjectMenusWithCategoryByRootUser(@Param("category") String category);

    /**
     * 根据用户id查询member_role表查角色，再根据角色查权限，根据权限查menu
     * @param memberId
     * @param sourceType
     * @param sourceId
     * @param category
     * @param memberType
     * @return
     */
    List<MenuDTO> selectMenusAfterCheckPermission(@Param("memberId")Long memberId,
                                                  @Param("sourceType")String sourceType,
                                                  @Param("sourceId")Long sourceId,
                                                  @Param("category")String category,
                                                  @Param("memberType")String memberType);

    /**
     * 根据层级查菜单附带权限，不包含top菜单
     * @param level
     * @return
     */
    List<MenuDTO> selectMenusWithPermission(String level);
}
