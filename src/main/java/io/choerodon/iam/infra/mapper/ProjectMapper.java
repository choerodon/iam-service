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
                                   @Param("param") String param);

    List<ProjectDO> selectProjectsByUserId(@Param("userId") Long userId,
                                           @Param("projectDO") ProjectDO projectDO);

    List selectProjectsByUserIdWithParam(@Param("userId") Long userId,
                                         @Param("projectDO") ProjectDO projectDO,
                                         @Param("param") String param);

    List<ProjectDO> selectProjectsWithRoles(
            @Param("id") Long id,
            @Param("start") Integer start,
            @Param("size") Integer size,
            @Param("params") String params);

    List<ProjectDO> selectUserProjectsUnderOrg(@Param("userId") Long userId,
                                               @Param("orgId") Long orgId,
                                               @Param("includeDisabled") boolean includeDisabled);


    List<Long> listUserIds(@Param("projectId") Long projectId);
}
