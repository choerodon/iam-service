package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;


/**
 * @author wuguokai
 */
public interface ProjectMapper extends Mapper<ProjectDTO> {

    List<ProjectDTO> fulltextSearch(@Param("project") ProjectDTO projectDTO,
                                   @Param("param") String param);

    List<ProjectDTO> selectProjectsByUserId(@Param("userId") Long userId,
                                           @Param("projectDTO") ProjectDTO projectDTO);

    List<ProjectDTO> selectProjectsByUserIdWithParam(@Param("userId") Long userId,
                                         @Param("projectDTO") ProjectDTO projectDTO,
                                         @Param("param") String param);

    List<ProjectDTO> selectProjectsWithRoles(
            @Param("id") Long id,
            @Param("start") Integer start,
            @Param("size") Integer size,
            @Param("params") String params);

    List<ProjectDTO> selectUserProjectsUnderOrg(@Param("userId") Long userId,
                                               @Param("orgId") Long orgId,
                                               @Param("isEnabled") Boolean isEnabled);


    List<Long> listUserIds(@Param("projectId") Long projectId);

    /**
     * 获取所有项目，附带项目类型名
     */
    List<ProjectDTO> selectAllWithProjectType();

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
     *
     * @param orgId
     * @return list
     */
    List<ProjectDTO> selectProjsNotGroup(@Param("orgId") Long orgId);

    /**
     * 获取组织下不是项目群的且无所属的项目
     *
     * @param orgId
     * @return
     */
    List<ProjectDTO> selectProjsNotInAnyGroup(@Param("orgId") Long orgId);
}
