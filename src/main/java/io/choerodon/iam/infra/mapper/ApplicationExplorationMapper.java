package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dataobject.ApplicationExplorationDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationExplorationMapper extends BaseMapper<ApplicationExplorationDO> {


    /**
     * 根据应用id集合查询该节点所有后代，包含自己
     *
     * @param idSet
     * @return
     */
    List selectDescendantByApplicationIds(@Param("idSet") Set<Long> idSet);

    /**
     * 根据应用id集合删除该节点所有的，包含自己
     *
     * @param idSet
     */
    void deleteDescendantByApplicationIds(@Param("idSet") Set<Long> idSet);

    /**
     * 根据应用id查询该节点所有后代，包含自己
     *
     * @param id
     * @return
     */
    List selectDescendantByApplicationId(@Param("id") Long id);

    /**
     * 根据应用id查询该节点所有去重的后代，不包含自己，附带应用code,name,category,type信息
     * @param id
     * @return
     */
    List selectDescendantApplicationExcludeSelf(@Param("id") Long id);

    /**
     * 根据应用id查询该节点所有祖先，包含自己
     *
     * @param id
     * @return
     */
    List selectAncestorByApplicationId(@Param("id") Long id);

    /**
     * 根据应用id删除该节点所有的，包含自己
     *
     * @param id
     */
    void deleteDescendantByApplicationId(@Param("id") Long id);


    /**
     * 根据应用id和父id删除所有子节点，包含自己
     *
     * @param idSet
     * @param parentId
     */
    void deleteDescendantByApplicationIdsAndParentId(@Param("idSet") Set<Long> idSet, @Param("parentId") Long parentId);

    /**
     * 根据应用id查询该节点的下一层级的后代
     *
     * @param id
     * @return
     */
    List selectDirectDescendantByApplicationId(@Param("id") Long id);

    /**
     * 根据应用节点id集合和该节点的父id查询该节点下的所有节点，包含自己
     *
     * @param idSet
     * @param parentId
     */
    List selectDescendantByApplicationIdsAndParentId(@Param("idSet") HashSet<Long> idSet, @Param("parentId") Long parentId);

    /**
     * 根据应用节点id和该节点的父id查询该节点下的所有节点，包含自己
     *
     * @param id
     * @param parentId
     * @return
     */
    List selectDescendantByApplicationIdAndParentId(@Param("id") Long id, @Param("parentId") Long parentId);

    /**
     * 查询组合应用下指定类型的应用{@link io.choerodon.iam.infra.enums.ApplicationCategory}
     *
     * @param id
     * @param category
     * @return
     */
    List selectDescendantApplications(@Param("id") Long id, @Param("category") String category,
                                      @Param("name") String name, @Param("code") String code);
}
