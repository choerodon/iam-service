package io.choerodon.iam.infra.mapper;

import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * @author Eugen
 */
public interface ProjectRelationshipMapper extends Mapper<ProjectRelationshipDTO> {
    /**
     * 查询一个项目群下的子项目(默认查所有子项目，可传参只查启用的子项目).
     *
     * @param parentId         父级Id
     * @param onlySelectEnable 是否只查启用项目
     * @return 项目群下的子项目列表
     */
    List<ProjectRelationshipDTO> selectProjectsByParentId(@Param("parentId") Long parentId, @Param("onlySelectEnable") Boolean onlySelectEnable);

    /**
     * 根据项目Id查询该项目已被分配的普通项目群信息.
     *
     * @param projectId        项目Id
     * @param onlySelectEnable 是否只查启用的项目群关系
     * @return 该项目已被分配的普通项目群信息
     */
    List<ProjectDTO> selectProgramsByProjectId(@Param("projectId") Long projectId, @Param("onlySelectEnable") Boolean onlySelectEnable);
}
