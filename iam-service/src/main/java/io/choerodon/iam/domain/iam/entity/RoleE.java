//package io.choerodon.iam.domain.iam.entity;
//
//import java.util.List;
//
///**
// * @author superlee
// */
//public class RoleE {
//
//    private Long id;
//    private String name;
//    private String code;
//    private String description;
//    private String level;
//    private Boolean enabled;
//    private Boolean modified;
//    private Boolean enableForbidden;
//    private Boolean builtIn;
//    private Boolean assignable;
//    private Long objectVersionNumber;
//    private List<PermissionE> permissions;
//    private List<RolePermissionE> rolePermissions;
//    private List<LabelE> labels;
//
//    public RoleE(Long id, String name, String code, String description, String level,
//                 Boolean enabled, Boolean modified, Boolean enableForbidden,
//                 Boolean builtIn, Boolean assignable, Long objectVersionNumber) {
//        this.id = id;
//        this.name = name;
//        this.code = code;
//        this.description = description;
//        this.level = level;
//        this.enabled = enabled;
//        this.modified = modified;
//        this.enableForbidden = enableForbidden;
//        this.builtIn = builtIn;
//        this.assignable = assignable;
//        this.objectVersionNumber = objectVersionNumber;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public String getLevel() {
//        return level;
//    }
//
//    public Boolean getEnabled() {
//        return enabled;
//    }
//
//    public Boolean getModified() {
//        return modified;
//    }
//
//    public Boolean getEnableForbidden() {
//        return enableForbidden;
//    }
//
//    public Boolean getBuiltIn() {
//        return builtIn;
//    }
//
//    public Boolean getAssignable() {
//        return assignable;
//    }
//
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public List<PermissionE> getPermissions() {
//        return permissions;
//    }
//
//    public void setPermissions(List<PermissionE> permissions) {
//        this.permissions = permissions;
//    }
//
//    public void createInit() {
//        this.builtIn = false;
//        this.enabled = true;
//        this.assignable = false;
//        this.enableForbidden = true;
//        this.modified = true;
//    }
//
//    public boolean removable() {
//        return !builtIn;
//    }
//
//    public void enable() {
//        this.enabled = true;
//    }
//
//    public void disable() {
//        this.enabled = false;
//    }
//
//    public List<RolePermissionE> getRolePermissions() {
//        return rolePermissions;
//    }
//
//    public void setRolePermissions(List<RolePermissionE> rolePermissions) {
//        this.rolePermissions = rolePermissions;
//    }
//
//    public List<LabelE> getLabels() {
//        return labels;
//    }
//
//    public void setLabels(List<LabelE> labels) {
//        this.labels = labels;
//    }
//
//    public void copyPermissionsAndLabels(RoleE roleE) {
//        this.permissions = roleE.getPermissions();
//        this.labels = roleE.getLabels();
//    }
//}
