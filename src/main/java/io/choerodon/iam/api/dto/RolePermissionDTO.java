//package io.choerodon.iam.api.dto;
//
//import io.swagger.annotations.ApiModelProperty;
//
//import javax.validation.constraints.NotEmpty;
//
///**
// * @author wuguokai
// */
//public class RolePermissionDTO {
//    @ApiModelProperty(value = "主键ID")
//    private Long id;
//    @ApiModelProperty(value = "角色ID/必填")
//    private Long roleId;
//    @ApiModelProperty(value = "权限ID/必填")
//    @NotEmpty(message = "error.rolePermission.permissionId.empty")
//    private Long permissionId;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getRoleId() {
//        return roleId;
//    }
//
//    public void setRoleId(Long roleId) {
//        this.roleId = roleId;
//    }
//
//    public Long getPermissionId() {
//        return permissionId;
//    }
//
//    public void setPermissionId(Long permissionId) {
//        this.permissionId = permissionId;
//    }
//}
