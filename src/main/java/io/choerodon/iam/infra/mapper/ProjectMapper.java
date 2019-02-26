package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.ProjectDTO;
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
                                               @Param("isEnabled") Boolean isEnabled);


    List<Long> listUserIds(@Param("projectId") Long projectId);

    /**
     * 获取所有项目，附带项目类型名
     */
    List<ProjectDO> selectAllWithProjectType();

    Boolean projectEnabled(@Param("sourceId") Long sourceId);

    List<ProjectDTO> selectByIds(@Param("ids") Set<Long> ids);

    /**
     * 获取组织下指定type的项目名
     *
     * @param type  项目类型Code
     * @param orgId 组织Id
     * @return 组织下指定type的项目名List
     */
    List<String> selectProjectNameByType(@Param("type") String type,
                                         @Param("orgId") Long orgId);


    /**
     * 获取组织下没有项目类型的项目名
     *
     * @param orgId 组织Id
     * @return 组织下没有项目类型的项目名List
     */
    List<String> selectProjectNameNoType(@Param("orgId") Long orgId);

    /**
     * 获取组织下不是项目群的项目
     * @param orgId
     * @return list
     */
    List<ProjectDTO> selectProjsNotGroup(@Param("orgId") Long orgId);
}
