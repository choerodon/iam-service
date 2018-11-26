package io.choerodon.iam.app.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 * @author wuguokai
 */
public interface UserService {

    UserDTO querySelf();

    List<OrganizationDTO> queryOrganizations(Long userId, Boolean includedDisabled);

    List<ProjectDTO> queryProjectsByOrganizationId(Long userId, Long organizationId);

    List<OrganizationDTO> queryOrganizationWithProjects();

    UserDTO queryByLoginName(String loginName);

    void selfUpdatePassword(Long userId, UserPasswordDTO userPasswordDTO, Boolean checkPassword);

    UserDTO lockUser(Long userId, Integer lockExpireTime);

    UserDTO queryInfo(Long userId);

    UserDTO updateInfo(UserDTO user);

    void check(UserDTO user);

    List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled);

    Page<UserWithRoleDTO> pagingQueryUsersWithSiteLevelRoles(PageRequest pageRequest,
                                                             RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    Page<UserWithRoleDTO> pagingQueryUsersWithOrganizationLevelRoles(PageRequest pageRequest,
                                                                     RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                     Long sourceId);

    Page<UserWithRoleDTO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest,
                                                                RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest,
                                                      RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest,
                                                              RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                              Long roleId, Long sourceId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest,
                                                         RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                         Long roleId, Long sourceId, boolean doPage);

    String uploadPhoto(Long id, MultipartFile file);

    String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    Page<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest, UserDO userDO, String params);

    void addAdminUsers(long[] ids);

    void deleteAdminUser(long id);

    /**
     * 根据用户id集合查询用户的集合
     *
     * @param ids 用户id数组
     * @return List<UserDTO> 用户集合
     */
    List<UserDTO> listUsersByIds(Long[] ids);

    /**
     * 根据用户emails集合查询用户的集合
     *
     * @param ids 用户email数组
     * @return List<UserDTO> 用户集合
     */
    List<UserDTO> listUsersByEmails(String[] emails);

    Page<OrganizationWithRoleDTO> pagingQueryOrganizationsWithRoles(PageRequest pageRequest,
                                                                    Long id, String params);

    Page<ProjectWithRoleDTO> pagingQueryProjectAndRolesById(PageRequest pageRequest,
                                                            Long id, String params);

    UserDTO createUserAndAssignRoles(CreateUserWithRolesDTO userWithRoles);

    Page<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                             PageRequest pageRequest, String params);

    Page<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                       PageRequest pageRequest, String params);

    Long[] listUserIds();

    Long queryOrgIdByEmail(String email);

    OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId);


    Page<SimplifiedUserDTO> pagingQueryAllUser(PageRequest pageRequest, String param);

    Page<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, PageRequest pageRequest, String param);
}
