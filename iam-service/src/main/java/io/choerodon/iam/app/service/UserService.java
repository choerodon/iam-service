package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.Page;
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

    Page<UserDTO> pagingQueryUsersWithSiteLevelRoles(int page,int size,
                                                             RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    Page<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(int page,int size,
                                                                     RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                     Long sourceId);

    Page<UserDTO> pagingQueryUsersWithProjectLevelRoles(int page,int size,
                                                                RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(int page,int size,
                                                      RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(int page,int size,
                                                              RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                              Long roleId, Long sourceId, boolean doPage);

    Page<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(int page, int size,
                                                         RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                         Long roleId, Long sourceId, boolean doPage);

    String uploadPhoto(Long id, MultipartFile file);

    String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    Page<UserDTO> pagingQueryAdminUsers(int page, int size, UserDTO userDTO, String params);

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

    Page<OrganizationDTO> pagingQueryOrganizationsWithRoles(int page, int size,
                                                                    Long id, String params);

    Page<ProjectDTO> pagingQueryProjectAndRolesById(int page, int size,
                                                    Long id, String params);

    UserDTO createUserAndAssignRoles(CreateUserWithRolesDTO userWithRoles);

    Page<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                             int page, int size, String params);

    Page<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                       int page, int size, String params);

    Long[] listUserIds();

    Long queryOrgIdByEmail(String email);

    OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId);


    Page<SimplifiedUserDTO> pagingQueryAllUser(int page, int size, String param, Long organizationId);

    Page<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, int page, int size, String param);

    Map<String, Object> queryAllAndNewUsers();

    Page<UserRoleDTO> pagingQueryRole(int page, int size, String param, Long userId);

}
