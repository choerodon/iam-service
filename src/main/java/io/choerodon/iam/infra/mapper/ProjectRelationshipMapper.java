package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;
import io.choerodon.mybatis.common.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author Eugen
 */
public interface ProjectRelationshipMapper extends BaseMapper<ProjectRelationshipDO> {
    /**
     * 查询一个项目群下的子项目(默认查所有子项目，可传参只查启用的子项目).
     *
     * @param parentId     父级Id
     * @param onlySelectEnable 是否只查启用项目
     * @return 项目群下的子项目列表
     */
    List<ProjectRelationshipDTO> selectProjectsByParentId(@Param("parentId") Long parentId,@Param("onlySelectEnable") Boolean onlySelectEnable);

    /**
     * 根据项目Id查询该项目已被分配的普通项目群数量.
     *
     * @param projectId 项目群的项目Id
     * @return 该项目已被分配的普通项目群数量
     */
    int selectProjectCountInProgramByProjectId(@Param("projectId") Long projectId);


}
