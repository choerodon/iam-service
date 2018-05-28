package io.choerodon.iam.app.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.*;
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

    UserInfoDTO queryByLoginName(String loginName);

    void selfUpdatePassword(Long userId, UserPasswordDTO userPasswordDTO, Boolean checkPassword);

    UserDTO lockUser(Long userId, Integer lockExpireTime);

    UserInfoDTO queryInfo(Long userId);

    UserInfoDTO updateInfo(UserInfoDTO userInfo);

    void check(UserDTO user);

    List<ProjectDTO> queryProjects(Long id, Boolean includedDisabled);

    Page<UserDTO> pagingQueryUsersWithSiteLevelRoles(PageRequest pageRequest,
                                                     RoleAssignmentSearchDTO roleAssignmentSearchDTO);

    Page<UserDTO> pagingQueryUsersWithOrganizationLevelRoles(PageRequest pageRequest,
                                                             RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                             Long sourceId);

    Page<UserDTO> pagingQueryUsersWithProjectLevelRoles(PageRequest pageRequest,
                                                        RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long sourceId);

    Page<UserDTO> pagingQueryUsersByRoleIdOnSiteLevel(PageRequest pageRequest,
                                                      RoleAssignmentSearchDTO roleAssignmentSearchDTO, Long roleId);

    Page<UserDTO> pagingQueryUsersByRoleIdOnOrganizationLevel(PageRequest pageRequest,
                                                              RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                              Long roleId, Long sourceId);

    Page<UserDTO> pagingQueryUsersByRoleIdOnProjectLevel(PageRequest pageRequest,
                                                         RoleAssignmentSearchDTO roleAssignmentSearchDTO,
                                                         Long roleId, Long sourceId);

    String uploadPhoto(Long id, MultipartFile file);


    Page<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest);

    void addAdminUsers(long[] ids);

    void deleteAdminUser(long id);
}
