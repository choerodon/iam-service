package io.choerodon.iam.infra.mapper;

import java.util.List;
import java.util.Set;

import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import io.choerodon.mybatis.common.Mapper;
import org.apache.ibatis.annotations.Param;

import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedUserDTO;
import io.choerodon.iam.api.dto.UserRoleDTO;

/**
 * @author wuguokai
 * @author superlee
 */
public interface UserMapper extends Mapper<UserDTO> {

    List<UserDTO> fulltextSearch(@Param("userSearchDTO") UserSearchDTO userSearchDTO,
                                @Param("param") String param);

    List<UserDTO> selectUserWithRolesByOption(
            @Param("roleAssignmentSearchDTO") RoleAssignmentSearchDTO roleAssignmentSearchDTO,
            @Param("sourceId") Long sourceId,
            @Param("sourceType") String sourceType,
            @Param("start") Integer start,
            @Param("size") Integer size,
            @Param("param") String param);

    int selectCountUsers(@Param("roleAssignmentSearchDTO")
                                 RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                         @Param("sourceId") Long sourceId,
                         @Param("sourceType") String sourceType,
                         @Param("param") String param);

    List<UserDTO> selectUsersByLevelAndOptions(@Param("sourceType") String sourceType,
                                              @Param("sourceId") Long sourceId,
                                              @Param("userId") Long userId,
                                              @Param("email") String email,
                                              @Param("param") String param);

    Integer selectUserCountFromMemberRoleByOptions(@Param("roleId") Long roleId,
                                                   @Param("memberType") String memberType,
                                                   @Param("sourceId") Long sourceId,
                                                   @Param("sourceType") String sourceType,
                                                   @Param("roleAssignmentSearchDTO")
                                                           RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                   @Param("param") String param);

    List<UserDTO> selectUsersFromMemberRoleByOptions(@Param("roleId") Long roleId,
                                            @Param("memberType") String memberType,
                                            @Param("sourceId") Long sourceId,
                                            @Param("sourceType") String sourceType,
                                            @Param("roleAssignmentSearchDTO")
                                                    RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                            @Param("param") String param);


    List<UserDTO> listUsersByIds(@Param("ids") Long[] ids, @Param("onlyEnabled") Boolean onlyEnabled);

    List<UserDTO> listUsersByEmails(@Param("emails") String[] emails);

    List<UserDTO> selectAdminUserPage(@Param("userDTO") UserDTO userDTO, @Param("params") String params);

    Set<String> matchLoginName(@Param("nameSet") Set<String> nameSet);

    Set<Long> getIdsByMatchLoginName(@Param("nameSet") Set<String> nameSet);

    void disableListByIds(@Param("idSet") Set<Long> ids);

    Set<String> matchEmail(@Param("emailSet") Set<String> emailSet);

    Long[] listUserIds();


    List<SimplifiedUserDTO> selectAllUsersSimplifiedInfo(@Param("params") String params);


    /**
     * 选择性查询用户，如果用户在组织下，则模糊查询，如果用户不在组织下精确匹配
     * @param param
     * @param organizationId
     * @return
     */
    List<SimplifiedUserDTO> selectUsersOptional(@Param("params") String param, @Param("organizationId") Long organizationId);

    /**
     * 全平台用户数（包括停用）
     *
     * @return 返回全平台用户数
     */
    Integer totalNumberOfUsers();

    /**
     * 全平台新增用户数（包括停用）
     *
     * @return 返回时间段内新增用户数
     */
    Integer newUsersByDate(@Param("begin") String begin,
                           @Param("end") String end);

    List<UserRoleDTO> selectRoles(@Param("userId") long id, @Param("params") String params);
}