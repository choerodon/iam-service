package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author Eugen
 */
public interface ProjectRelationshipMapper extends BaseMapper<ProjectRelationshipDO> {
    /**
     * 查询一个项目群下的所有项目(groupid,id,code,name)
     *
     * @param parentId 项目群的项目Id
     * @return 项目Id
     */
    List<ProjectRelationshipDTO> seleteProjectsByParentId(@Param("parentId") Long parentId);


}
