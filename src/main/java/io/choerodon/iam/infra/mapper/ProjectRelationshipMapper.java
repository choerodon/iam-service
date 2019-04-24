package io.choerodon.iam.infra.mapper;

import java.util.List;

import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;


/**
 * @author Eugen
 */
public interface ProjectRelationshipMapper extends Mapper<ProjectRelationshipDTO> {
    /**
     * 查询一个项目群下的所有项目(groupid,id,code,name)
     *
     * @param parentId 项目群的项目Id
     * @return 项目Id
     */
    List<ProjectRelationshipDTO> selectProjectsByParentId(@Param("parentId") Long parentId);


}
