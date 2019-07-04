package io.choerodon.iam.api.dto.payload;

import java.util.List;

public class ModelPublishPayload {

    private String modelCode;
    private Long organizationId;

    private Menu menu;
    private List<Role> roles;


    public String getModelCode() {
        return modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public static class Role {
        private Long id;
        private String code;
        private String name;
        private List<Permission> permissions;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<Permission> getPermissions() {
            return permissions;
        }

        public void setPermissions(List<Permission> permissions) {
            this.permissions = permissions;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }

    public static class Menu {
        private String name;
        private String icon;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }
    }

    public static class Permission {
        private String type;
        private String roleCode;
        private Boolean operateFlag;

        private Boolean disableSelectFlag;
        private Boolean disableInsertFlag;
        private Boolean disableUpdateFlag;
        private Boolean disableDeleteFlag;

        private String disableFieldName;
        private Boolean disableFieldSelectFlag;
        private Boolean disableFieldInsertFlag;
        private Boolean disableFieldUpdateFlag;

        private Boolean onlySelfSelectFlag;
        private Boolean onlySelfUpdateFlag;
        private Boolean onlySelfDeleteFlag;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getRoleCode() {
            return roleCode;
        }

        public void setRoleCode(String roleCode) {
            this.roleCode = roleCode;
        }

        public Boolean getOperateFlag() {
            return operateFlag;
        }

        public void setOperateFlag(Boolean operateFlag) {
            this.operateFlag = operateFlag;
        }

        public Boolean getDisableSelectFlag() {
            return disableSelectFlag;
        }

        public void setDisableSelectFlag(Boolean disableSelectFlag) {
            this.disableSelectFlag = disableSelectFlag;
        }

        public Boolean getDisableInsertFlag() {
            return disableInsertFlag;
        }

        public void setDisableInsertFlag(Boolean disableInsertFlag) {
            this.disableInsertFlag = disableInsertFlag;
        }

        public Boolean getDisableUpdateFlag() {
            return disableUpdateFlag;
        }

        public void setDisableUpdateFlag(Boolean disableUpdateFlag) {
            this.disableUpdateFlag = disableUpdateFlag;
        }

        public Boolean getDisableDeleteFlag() {
            return disableDeleteFlag;
        }

        public void setDisableDeleteFlag(Boolean disableDeleteFlag) {
            this.disableDeleteFlag = disableDeleteFlag;
        }

        public String getDisableFieldName() {
            return disableFieldName;
        }

        public void setDisableFieldName(String disableFieldName) {
            this.disableFieldName = disableFieldName;
        }

        public Boolean getDisableFieldSelectFlag() {
            return disableFieldSelectFlag;
        }

        public void setDisableFieldSelectFlag(Boolean disableFieldSelectFlag) {
            this.disableFieldSelectFlag = disableFieldSelectFlag;
        }

        public Boolean getDisableFieldInsertFlag() {
            return disableFieldInsertFlag;
        }

        public void setDisableFieldInsertFlag(Boolean disableFieldInsertFlag) {
            this.disableFieldInsertFlag = disableFieldInsertFlag;
        }

        public Boolean getDisableFieldUpdateFlag() {
            return disableFieldUpdateFlag;
        }

        public void setDisableFieldUpdateFlag(Boolean disableFieldUpdateFlag) {
            this.disableFieldUpdateFlag = disableFieldUpdateFlag;
        }

        public Boolean getOnlySelfSelectFlag() {
            return onlySelfSelectFlag;
        }

        public void setOnlySelfSelectFlag(Boolean onlySelfSelectFlag) {
            this.onlySelfSelectFlag = onlySelfSelectFlag;
        }

        public Boolean getOnlySelfUpdateFlag() {
            return onlySelfUpdateFlag;
        }

        public void setOnlySelfUpdateFlag(Boolean onlySelfUpdateFlag) {
            this.onlySelfUpdateFlag = onlySelfUpdateFlag;
        }

        public Boolean getOnlySelfDeleteFlag() {
            return onlySelfDeleteFlag;
        }

        public void setOnlySelfDeleteFlag(Boolean onlySelfDeleteFlag) {
            this.onlySelfDeleteFlag = onlySelfDeleteFlag;
        }
    }
}
