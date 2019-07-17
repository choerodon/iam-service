package io.choerodon.iam.app.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.base.enums.ResourceType;
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

    PageInfo<UserDTO> pagingQueryUsersWithRoles(PageRequest pageRequest,
                                                         RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId, ResourceType resourceType);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest,
                                                          RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId, boolean doPage);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest,
                                                                  RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                                  Long roleId, Long sourceId, boolean doPage);

    PageInfo<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest,
                                                             RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                             Long roleId, Long sourceId, boolean doPage);

    String uploadPhoto(Long id, MultipartFile file);

    String savePhoto(Long id, MultipartFile file, Double rotate, Integer axisX, Integer axisY, Integer width, Integer height);

    PageInfo<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest, UserDTO userDTO, String params);

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

    PageInfo<OrganizationDTO> pagingQueryOrganizationsWithRoles(PageRequest pageRequest,
                                                                Long id, String params);

    PageInfo<ProjectDTO> pagingQueryProjectAndRolesById(PageRequest pageRequest,
                                                        Long id, String params);

    UserDTO createUserAndAssignRoles(CreateUserWithRolesDTO userWithRoles);

    PageInfo<ProjectDTO> pagingQueryProjectsSelf(ProjectDTO projectDTO,
                                                 PageRequest pageRequest, String params);

    PageInfo<OrganizationDTO> pagingQueryOrganizationsSelf(OrganizationDTO organizationDTO,
                                                           PageRequest pageRequest, String params);

    Long[] listUserIds();

    Long queryOrgIdByEmail(String email);

    OrganizationProjectDTO queryByUserIdWithRoleOrganizationAndProject(Long userId);


    PageInfo<SimplifiedUserDTO> pagingQueryAllUser(PageRequest pageRequest, String param, Long organizationId);

    PageInfo<UserDTO> pagingQueryUsersOnSiteLevel(Long userId, String email, PageRequest pageRequest, String param);

    Map<String, Object> queryAllAndNewUsers();

    PageInfo<UserRoleDTO> pagingQueryRole(PageRequest pageRequest, String param, Long userId, Long organizationId);

    /**
     * 根据loginName集合查询所有用户
     *
     * @param loginNames
     * @param onlyEnabled
     * @return
     */
    List<UserDTO> listUsersByLoginNames(String[] loginNames, Boolean onlyEnabled);

    /**
     * 异步
     * 向用户发送通知（包括邮件和站内信）
     *
     * @param fromUserId 发送通知的用户
     * @param userIds    接受通知的目标用户
     * @param code       业务code
     * @param params     渲染参数
     * @param sourceId   触发发送通知对应的组织/项目id，如果是site层，可以为0或null
     */
    Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code, Map<String, Object> params, Long sourceId);

    Future<String> sendNotice(Long fromUserId, List<Long> userIds, String code, Map<String, Object> params, Long sourceId, boolean sendAll);

    UserDTO updateUserDisabled(Long userId);

}
