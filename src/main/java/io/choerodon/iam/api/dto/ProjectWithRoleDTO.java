package io.choerodon.iam.api.dto;

import java.util.List;

public class ProjectWithRoleDTO extends ProjectDTO {

    private String organizationName;

    private List<RoleDTO> roles;

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
