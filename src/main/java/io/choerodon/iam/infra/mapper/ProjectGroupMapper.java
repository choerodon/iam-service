package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.ProjectGroupDTO;
import io.choerodon.iam.infra.dataobject.ProjectGroupDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author Eugen
 */
public interface ProjectGroupMapper extends BaseMapper<ProjectGroupDO> {
    /**
     * 查询一个项目群下的所有项目(groupid,id,code,name)
     *
     * @param parentId 项目群的项目Id
     * @return 项目Id
     */
    List<ProjectGroupDTO> seleteProjectsByParentId(@Param("parentId") Long parentId);


}
