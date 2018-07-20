package io.choerodon.iam.api.dto;

import java.util.List;

public class OrganizationWithRoleDTO extends OrganizationDTO {

    private List<RoleDTO> roles;

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
