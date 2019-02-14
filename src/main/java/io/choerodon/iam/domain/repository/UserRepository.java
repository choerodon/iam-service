package io.choerodon.iam.domain.repository;

import java.util.List;
import java.util.Set;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.RoleAssignmentSearchDTO;
import io.choerodon.iam.api.dto.SimplifiedUserDTO;
import io.choerodon.iam.api.dto.UserRoleDTO;
import io.choerodon.iam.domain.iam.entity.UserE;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author dongfan117@gmail.com
 * @author superlee
 */
public interface UserRepository {

    UserE selectByLoginName(String loginName);

    int selectCount(UserDO user);

    UserDO insertSelective(UserDO userDO);

    Page<UserDO> pagingQuery(PageRequest pageRequest, UserDO userDO, String param);

    UserE selectByPrimaryKey(Long id);

    UserE updateSelective(UserE userE);

    void updatePhoto(Long userId, String photoUrl);

    void deleteById(Long id);

    Page<UserDO> pagingQueryUsersWithSiteLevelRoles(
            PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    Page<UserDO> pagingQueryUsersWithOrganizationLevelRoles(
            PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId);

    Page<UserDO> pagingQueryUsersWithProjectLevelRoles(
            PageRequest pageRequest, RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage);

    UserE updateUserInfo(UserE userE);

    UserDO selectOne(UserDO user);

    Page<UserDO> pagingQueryUsersByProjectId(Long projectId, Long userId, String email, PageRequest pageRequest, String param);

    Page<UserDO> pagingQueryUsersByOrganizationId(Long organizationId, Long userId, String email, PageRequest pageRequest, String param);

    Page<UserDO> pagingQueryUsersOnSiteLevel(Long userId, String email, PageRequest pageRequest, String param);

    Integer selectUserCountFromMemberRoleByOptions(Long roleId, String memberType, Long sourceId,
                                                   String sourceType, RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                   String param);

    List<UserDO> listUsersByRoleIdOnSiteLevel(Long roleId);

    List<UserDO> listUsersByRoleIdOnOrganizationLevel(Long orgId, Long roleId);

    List<UserDO> listUsersByRoleIdOnProjectLevel(Long proId, Long roleId);

    Page<UserDO> pagingQueryUsersByRoleIdAndLevel(PageRequest pageRequest,
                                                  RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, Long sourceId, String level, boolean doPage);

    List<UserDO> listUsersByRoleId(Long roleId, String memberType, String sourceType);

    /**
     * 根据用户id集合查询用户的集合
     *
     * @param ids         用户id数组
     * @param onlyEnabled 是否只查询启用的用户
     * @return List<UserDO> 用户集合
     */
    List<UserDO> listUsersByIds(Long[] ids, Boolean onlyEnabled);

    /**
     * 根据用户emails集合查询用户的集合
     *
     * @param emails 用户email数组
     * @return List<UserDO> 用户集合
     */
    List<UserDO> listUsersByEmails(String[] emails);

    Page<UserDO> pagingQueryAdminUsers(PageRequest pageRequest, UserDO userDO, String params);

    List<UserDO> insertList(List<UserDO> insertUsers);

    Set<String> matchLoginName(Set<String> nameSet);

    Set<Long> getIdsByMatchLoginName(Set<String> nameSet);

    void disableByIdList(Set<Long> ids);

    Set<String> matchEmail(Set<String> emailSet);

    Long[] listUserIds();

    Page<SimplifiedUserDTO> pagingAllUsersByParams(PageRequest pageRequest, String param);

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
    Page<UserRoleDTO> pagingQueryRole(PageRequest pageRequest, String param, Long userId);

    List<UserDO> select(UserDO example);
}
