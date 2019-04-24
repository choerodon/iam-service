package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.ApplicationDTO;
import io.choerodon.iam.infra.dto.ApplicationExplorationDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author superlee
 * @since 0.15.0
 */
public interface ApplicationExplorationMapper extends Mapper<ApplicationExplorationDTO> {


    /**
     * 根据应用id集合查询该节点所有后代，包含自己
     *
     * @param idSet
     * @return
     */
    List<ApplicationExplorationDTO> selectDescendantByApplicationIds(@Param("idSet") Set<Long> idSet);

    /**
     * 根据应用id集合删除该节点所有的，包含自己
     *
     * @param idSet
     */
    void deleteDescendantByApplicationIds(@Param("idSet") Set<Long> idSet);

    /**
     * 根据应用id查询该节点所有后代，包含自己
     *
     * @param path
     * @return
     */
    List<ApplicationExplorationDTO> selectDescendantByPath(@Param("path") String path);

    /**
     * 根据应用id查询该节点所有祖先，包含自己
     *
     * @param id
     * @return
     */
    List<ApplicationExplorationDTO> selectAncestorByApplicationId(@Param("id") Long id);

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
    List<ApplicationExplorationDTO> selectDirectDescendantByApplicationId(@Param("id") Long id);

    /**
     * 根据应用节点id集合和该节点的父id查询该节点下的所有节点，包含自己
     *
     * @param idSet
     * @param parentId
     */
    List<ApplicationExplorationDTO> selectDescendantByApplicationIdsAndParentId(@Param("idSet") HashSet<Long> idSet, @Param("parentId") Long parentId);

    /**
     * 根据应用节点id和该节点的父id查询该节点下的所有节点，包含自己
     *
     * @param id
     * @param parentId
     * @return
     */
    List<ApplicationExplorationDTO> selectDescendantByApplicationIdAndParentId(@Param("id") Long id, @Param("parentId") Long parentId);

    /**
     * 查询组合应用下指定类型的应用{@link io.choerodon.iam.infra.enums.ApplicationCategory}
     *
     * @param path
     * @param category
     * @param code
     * @param name
     * @return
     */
    List<ApplicationDTO> selectDescendantApplications(@Param("path") String path, @Param("category") String category,
                                                      @Param("name") String name, @Param("code") String code);

    /**
     * 根据应用id查询子代，包含自己，带上应用和项目信息
     *
     * @param path "/"+id+"/"
     * @return
     */
    List<ApplicationExplorationDTO> selectDescendants(@Param("path") String path);
}
