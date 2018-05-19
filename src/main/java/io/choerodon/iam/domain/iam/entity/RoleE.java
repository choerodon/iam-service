package io.choerodon.iam.domain.iam.entity;

import java.util.List;

/**
 * @author superlee
 */
public class RoleE {

    public static final String SITE_ADMINISTRATOR_CODE = "role/site/default/administrator";

    public static final String ORGANIZATION_ADMINISTRATOR_CODE = "role/organization/default/administrator";

    public static final String PROJECT_ADMINISTRATOR_CODE = "role/project/default/administrator";

    private Long id;
    private String name;
    private String code;
    private String description;
    private String level;
    private Boolean isEnabled;
    private Boolean isModified;
    private Boolean isEnableForbidden;
    private Boolean isBuiltIn;
    private Boolean isAssignable;
    private Long objectVersionNumber;
    private List<PermissionE> permissions;
    private List<RolePermissionE> rolePermissions;
    private List<LabelE> labels;

    public RoleE(Long id, String name, String code, String description, String level,
                 Boolean isEnabled, Boolean isModified, Boolean isEnableForbidden,
                 Boolean isBuiltIn, Boolean isAssignable, Long objectVersionNumber) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.level = level;
        this.isEnabled = isEnabled;
        this.isModified = isModified;
        this.isEnableForbidden = isEnableForbidden;
        this.isBuiltIn = isBuiltIn;
        this.isAssignable = isAssignable;
        this.objectVersionNumber = objectVersionNumber;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public String getLevel() {
        return level;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public Boolean getModified() {
        return isModified;
    }

    public Boolean getEnableForbidden() {
        return isEnableForbidden;
    }

    public Boolean getBuiltIn() {
        return isBuiltIn;
    }

    public Boolean getAssignable() {
        return isAssignable;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public List<PermissionE> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionE> permissions) {
        this.permissions = permissions;
    }

    public void createInit() {
        this.isBuiltIn = false;
        this.isEnabled = true;
        this.isAssignable = false;
        this.isEnableForbidden = true;
        this.isModified = true;
    }

    public boolean removable() {
        return !isBuiltIn;
    }

    public void enable() {
        this.isEnabled = true;
    }

    public void disable() {
        this.isEnabled = false;
    }

    public List<RolePermissionE> getRolePermissions() {
        return rolePermissions;
    }

    public void setRolePermissions(List<RolePermissionE> rolePermissions) {
        this.rolePermissions = rolePermissions;
    }

    public List<LabelE> getLabels() {
        return labels;
    }

    public void setLabels(List<LabelE> labels) {
        this.labels = labels;
    }

    public void copyPermissionsAndLabels(RoleE roleE) {
        this.permissions = roleE.getPermissions();
        this.labels = roleE.getLabels();
    }
}
