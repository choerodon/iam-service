package io.choerodon.iam.domain.repository;

import java.util.List;
import java.util.Set;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedUserDTO;
import io.choerodon.iam.api.dto.UserRoleDTO;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.infra.dto.UserDTO;

/**
 * @author dongfan117@gmail.com
 * @author superlee
 */
public interface UserRepository {

    UserDTO selectByLoginName(String loginName);

    int selectCount(UserDTO user);

    UserDTO insertSelective(UserDTO userDTO);

    PageInfo<UserDTO> pagingQuery(int page, int size, UserSearchDTO userSearchDTO, String param);

    UserDTO selectByPrimaryKey(Long id);

    UserDTO updateSelective(UserDTO userDTO);

    void updatePhoto(Long userId, String photoUrl);

    void deleteById(Long id);

    PageInfo<UserDTO> pagingQueryUsersWithSiteLevelRoles(
            int page,int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    PageInfo<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(
            int page,int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId);

    PageInfo<UserDTO> pagingQueryUsersWithProjectLevelRoles(
            int page,int size, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage);

    UserDTO updateUserInfo(UserDTO userDTO);

    UserDTO selectOne(UserDTO user);

    PageInfo<UserDTO> pagingQueryUsersByProjectId(Long projectId, Long userId, String email, int page, int size, String param);

    PageInfo<UserDTO> pagingQueryUsersByOrganizationId(Long organizationId, Long userId, String email, int page, int size, String param);

    PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, int page, int size, String param);

    Integer selectUserCountFromMemberRoleByOptions(Long roleId, String memberType, Long sourceId,
                                                   String sourceType, RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                   String param);

    List<UserDTO> listUsersByRoleIdOnSiteLevel(Long roleId);

    List<UserDTO> listUsersByRoleIdOnOrganizationLevel(Long orgId, Long roleId);

    List<UserDTO> listUsersByRoleIdOnProjectLevel(Long proId, Long roleId);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdAndLevel(int page, int size,
                                                  RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, String level, boolean doPage);

    List<UserDTO> listUsersByRoleId(Long roleId, String memberType, String sourceType);

    /**
     * 根据用户id集合查询用户的集合
     *
     * @param ids         用户id数组
     * @param onlyEnabled 是否只查询启用的用户
     * @return List<UserDTO> 用户集合
     */
    List<UserDTO> listUsersByIds(Long[] ids, Boolean onlyEnabled);

    /**
     * 根据用户emails集合查询用户的集合
     *
     * @param emails 用户email数组
     * @return List<UserDTO> 用户集合
     */
    List<UserDTO> listUsersByEmails(String[] emails);

    /**
     * 根据登录名集合查所有用户
     * @param loginNames
     * @param onlyEnabled
     * @return
     */
    List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled);

    PageInfo<UserDTO> pagingQueryAdminUsers(int page, int size, UserDTO userDTO, String params);

    List<UserDTO> insertList(List<UserDTO> insertUsers);

    Set<String> matchLoginName(Set<String> nameSet);

    Set<Long> getIdsByMatchLoginName(Set<String> nameSet);

    void disableByIdList(Set<Long> ids);

    Set<String> matchEmail(Set<String> emailSet);

    Long[] listUserIds();

    PageInfo<SimplifiedUserDTO> pagingAllUsersByParams(int page, int size, String param, Long organizationId);

    /**
     * 全平台用户数（包括停用）
     *
     * @return 返回全平台用户数
     */
    Integer totalNumberOfUsers();

    /**
     * 全平台新增用户数（包括停用）
     *
     * @return 返回今日新增用户数
     */
    Integer newUsersToday();

    /**
     * 分页获取用户下所有角色列表
     */
    PageInfo<UserRoleDTO> pagingQueryRole(int page, int size, String param, Long userId);

    List<UserDTO> select(UserDTO example);
}
