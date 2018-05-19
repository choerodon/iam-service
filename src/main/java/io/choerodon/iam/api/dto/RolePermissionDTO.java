package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author wuguokai
 */
public class RolePermissionDTO {
    private Long id;
    private Long roleId;
    @NotEmpty(message = "errpr.rolePermission.permissionId.empty")
    private Long permissionId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }
}
