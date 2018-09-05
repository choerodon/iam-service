package io.choerodon.iam.domain.iam.entity;

/**
 * @author wuguokai
 */
public class PermissionE {
    private Long id;
    private String code;
    private String path;
    private String method;
    private String level;
    private String description;
    private String action;
    private String resource;
    private Boolean publicAccess;
    private Boolean loginAccess;
    private Boolean within;
    private String serviceName;
    private Long objectVersionNumber;

    public PermissionE(String code, String path, String method, String level, String description, String action,
                       String resource, Boolean publicAccess, Boolean loginAccess, Boolean within, String serviceName, Long objectVersionNumber) {
        this.code = code;
        this.path = path;
        this.method = method;
        this.level = level;
        this.description = description;
        this.action = action;
        this.resource = resource;
        this.publicAccess = publicAccess;
        this.loginAccess = loginAccess;
        this.within = within;
        this.serviceName = serviceName;
        this.objectVersionNumber = objectVersionNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getCode() {
        return code;
    }

    public String getPath() {
        return path;
    }

    public String getMethod() {
        return method;
    }

    public String getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }

    public String getAction() {
        return action;
    }

    public String getResource() {
        return resource;
    }

    public Boolean getPublicAccess() {
        return publicAccess;
    }

    public Boolean getLoginAccess() {
        return loginAccess;
    }

    public Boolean getWithin() {
        return within;
    }

    public String getServiceName() {
        return serviceName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PermissionE that = (PermissionE) o;

        if (!code.equals(that.code)) return false;
        if (!path.equals(that.path)) return false;
        if (!method.equals(that.method)) return false;
        if (!level.equals(that.level)) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (!action.equals(that.action)) return false;
        if (!resource.equals(that.resource)) return false;
        if (!publicAccess.equals(that.publicAccess)) return false;
        if (!loginAccess.equals(that.loginAccess)) return false;
        if (!within.equals(that.within)) return false;
        if (!serviceName.equals(that.serviceName)) return false;
        return objectVersionNumber != null ? objectVersionNumber.equals(that.objectVersionNumber) : that.objectVersionNumber == null;
    }

    @Override
    public int hashCode() {
        int result = code.hashCode();
        result = 31 * result + path.hashCode();
        result = 31 * result + method.hashCode();
        result = 31 * result + level.hashCode();
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + action.hashCode();
        result = 31 * result + resource.hashCode();
        result = 31 * result + publicAccess.hashCode();
        result = 31 * result + loginAccess.hashCode();
        result = 31 * result + within.hashCode();
        result = 31 * result + serviceName.hashCode();
        result = 31 * result + (objectVersionNumber != null ? objectVersionNumber.hashCode() : 0);
        return result;
    }
}
