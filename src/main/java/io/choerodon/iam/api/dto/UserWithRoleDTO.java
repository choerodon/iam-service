package io.choerodon.iam.api.dto;

import java.util.List;

/**
 * @author flyleft
 * @date 2018/5/30
 */
public class UserWithRoleDTO extends UserDTO {

    private List<RoleDTO> roles;

    @Override
    public List<RoleDTO> getRoles() {
        return roles;
    }

    @Override
    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
