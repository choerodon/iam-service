package io.choerodon.iam.app.service;

import io.choerodon.core.domain.Page;
import io.choerodon.iam.api.dto.UserDTO;
import io.choerodon.iam.api.dto.UserSearchDTO;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author superlee
 * @data 2018/3/26
 */
public interface OrganizationUserService {

    UserDTO create(UserDTO userDTO, boolean checkPassword);

    Page<UserDTO> pagingQuery(PageRequest pageRequest, UserSearchDTO user);

    UserDTO update(UserDTO userDTO);

    void delete(Long organizationId, Long id);

    UserDTO query(Long organizationId, Long id);

    UserDTO unlock(Long organizationId, Long userId);

    UserDTO enableUser(Long organizationId, Long userId);

    UserDTO disableUser(Long organizationId, Long userId);
}
