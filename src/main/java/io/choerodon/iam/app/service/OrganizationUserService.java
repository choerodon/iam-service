package io.choerodon.iam.app.service;

import com.github.pagehelper.PageInfo;
import io.choerodon.base.domain.PageRequest;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.iam.infra.dto.LdapErrorUserDTO;
import io.choerodon.iam.infra.dto.UserDTO;

import java.util.List;

/**
 * @author superlee
 * @data 2018/3/26
 */
public interface OrganizationUserService {

    UserDTO create(UserDTO userDTO, boolean checkPassword);

    PageInfo<UserDTO> pagingQuery(PageRequest pageRequest, UserSearchDTO user);

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
     * @param insertUsers
     */
    List<LdapErrorUserDTO> batchCreateUsers(List<UserDTO> insertUsers);

    List<Long> listUserIds(Long organizationId);

}
