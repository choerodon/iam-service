package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.*;
import io.choerodon.iam.infra.dataobject.UserDO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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


    Page<UserDTO> pagingQueryAdminUsers(PageRequest pageRequest, UserDO userDO, String params);

    void addAdminUsers(long[] ids);

    void deleteAdminUser(long id);

    /**
     * 根据用户id集合查询用户的集合
     * @param ids 用户id数组
     * @return List<UserDTO> 用户集合
     */
    List<UserDTO> listUsersByIds(Long[] ids);
}
