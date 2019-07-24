package io.choerodon.iam.app.service;

import java.util.List;

import com.github.pagehelper.PageInfo;

import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.UserDTO;

/**
 * @author superlee
 * @since 2018/3/26
 */
public interface OrganizationUserService {

    UserDTO create(UserDTO userDTO, boolean checkPassword);

    PageInfo<UserDTO> pagingQuery(int page, int size, UserSearchDTO user);

    UserDTO update(UserDTO userDTO);

    UserDTO resetUserPassword(Long organizationId, Long userId);

    void delete(Long organizationId, Long id);

    UserDTO query(Long organizationId, Long id);

    UserDTO unlock(Long organizationId, Long userId);

    UserDTO enableUser(Long organizationId, Long userId);

    UserDTO disableUser(Long organizationId, Long userId);

    /**
     * ldap 批量同步用户，发送事件
     *
     * @param insertUsers 用户信息列表
     */
    List<LdapErrorUserDTO> batchCreateUsers(List<UserDTO> insertUsers);

    List<Long> listUserIds(Long organizationId);

}
