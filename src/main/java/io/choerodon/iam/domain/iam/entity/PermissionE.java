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
    private String serviceName;
    private Long objectVersionNumber;

    public PermissionE(String code, String path, String method, String level, String description, String action,
                       String resource, Boolean publicAccess, Boolean loginAccess, String serviceName, Long objectVersionNumber) {
        this.code = code;
        this.path = path;
        this.method = method;
        this.level = level;
        this.description = description;
        this.action = action;
        this.resource = resource;
        this.publicAccess = publicAccess;
        this.loginAccess = loginAccess;
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

    public String getServiceName() {
        return serviceName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PermissionE that = (PermissionE) o;

        if (code != null ? !code.equals(that.code) : that.code != null) {
            return false;
        }
        if (path != null ? !path.equals(that.path) : that.path != null) {
            return false;
        }
        if (method != null ? !method.equals(that.method) : that.method != null) {
            return false;
        }
        if (level != null ? !level.equals(that.level) : that.level != null) {
            return false;
        }
        if (description != null ? !description.equals(that.description) : that.description != null) {
            return false;
        }
        if (publicAccess != null ? !publicAccess.equals(that.publicAccess) : that.publicAccess != null) {
            return false;
        }
        return loginAccess != null ? loginAccess.equals(that.loginAccess) : that.loginAccess == null;
    }

    @Override
    public int hashCode() {
        int result = code != null ? code.hashCode() : 0;
        result = 31 * result + (path != null ? path.hashCode() : 0);
        result = 31 * result + (method != null ? method.hashCode() : 0);
        result = 31 * result + (level != null ? level.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (publicAccess != null ? publicAccess.hashCode() : 0);
        result = 31 * result + (loginAccess != null ? loginAccess.hashCode() : 0);
        return result;
    }
}
