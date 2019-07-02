package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.PageInfo;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.infra.dto.OrganizationDTO;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;


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

    RegistrantInfoDTO queryRegistrantInfoAndAdmin(String orgCode);

    UserDTO updateInfo(UserDTO user);

    void check(UserDTO user);

    List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled);

    PageInfo<UserDTO> pagingQueryUsersWithSiteLevelRoles(int page,int size,
                                                             RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    PageInfo<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(int page,int size,
                                                                     RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                     Long sourceId);

    PageInfo<UserDTO> pagingQueryUsersWithProjectLevelRoles(int page,int size,
                                                                RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(int page, int size,
                                                          RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(int page,int size,
                                                              RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                              Long roleId, Long sourceId, boolean doPage);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(int page, int size,
                                                         RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                         Long roleId, Long sourceId, boolean doPage);

    String uploadPhoto(Long id, MultipartFile file);

    String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    PageInfo<UserDTO> pagingQueryAdminUsers(int page, int size, UserDTO userDTO, String params);

    void addAdminUsers(long[] ids);

    void deleteAdminUser(long id);

    /**
     * 根据用户id集合查询用户的集合
     *
     * @param ids         用户id数组
     * @param onlyEnabled 默认为true，只查询启用的用户
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

    PageInfo<OrganizationDTO> pagingQueryOrganizationsWithRoles(int page, int size,
                                                                    Long id, String params);

    PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(int page, int size,
                                                    Long id, String params);

    UserDTO createUserAndAssignRoles(CreateUserWithRolesDTO userWithRoles);

    PageInfo<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                             int page, int size, String params);

    PageInfo<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                       int page, int size, String params);

    Long[] listUserIds();

    Long queryOrgIdByEmail(String email);

    OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId);


    PageInfo<SimplifiedUserDTO> pagingQueryAllUser(int page, int size, String param, Long organizationId);

    PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, int page, int size, String param);

    Map<String, Object> queryAllAndNewUsers();

    PageInfo<UserRoleDTO> pagingQueryRole(int page, int size, String param, Long userId, Long organizationId);

    /**
     * 根据loginName集合查询所有用户
     * @param loginNames
     * @param onlyEnabled
     * @return
     */
    List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled);
}
