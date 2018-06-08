package io.choerodon.iam.api.dto;

import java.util.List;

/**
 * @author flyleft
 * @date 2018/5/30
 */
public class UserWithRoleDTO extends UserDTO {

    private List<RoleDTO> roles;

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
