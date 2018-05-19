package io.choerodon.iam.infra.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.mybatis.common.BaseMapper;

/**
 * @author wuguokai
 */
public interface ProjectMapper extends BaseMapper<ProjectDO> {

    List<ProjectDO> fulltextSearch(@Param("project") ProjectDO projectDO,
                                   @Param("params") String[] params);

    List selectProjectsFromMemberRoleByOption(@Param("userId") Long userId,
                                              @Param("projectDO") ProjectDO projectDO);
}
