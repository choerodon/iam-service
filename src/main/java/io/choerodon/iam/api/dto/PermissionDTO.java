package io.choerodon.iam.api.dto;

/**
 * @author wuguokai
 */
public class PermissionDTO {
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getResource() {
        return resource;
    }

    public void setResource(String resource) {
        this.resource = resource;
    }

    public Boolean getPublicAccess() {
        return publicAccess;
    }

    public void setPublicAccess(Boolean publicAccess) {
        this.publicAccess = publicAccess;
    }

    public Boolean getLoginAccess() {
        return loginAccess;
    }

    public void setLoginAccess(Boolean loginAccess) {
        this.loginAccess = loginAccess;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        PermissionDTO that = (PermissionDTO) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (code != null ? !code.equals(that.code) : that.code != null) return false;
        if (path != null ? !path.equals(that.path) : that.path != null) return false;
        if (method != null ? !method.equals(that.method) : that.method != null) return false;
        if (level != null ? !level.equals(that.level) : that.level != null) return false;
        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (action != null ? !action.equals(that.action) : that.action != null) return false;
        if (resource != null ? !resource.equals(that.resource) : that.resource != null) return false;
        if (publicAccess != null ? !publicAccess.equals(that.publicAccess) : that.publicAccess != null) return false;
        if (loginAccess != null ? !loginAccess.equals(that.loginAccess) : that.loginAccess != null) return false;
        if (serviceName != null ? !serviceName.equals(that.serviceName) : that.serviceName != null) return false;
        return objectVersionNumber != null ? objectVersionNumber.equals(that.objectVersionNumber) : that.objectVersionNumber == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (path != null ? path.hashCode() : 0);
        result = 31 * result + (method != null ? method.hashCode() : 0);
        result = 31 * result + (level != null ? level.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (action != null ? action.hashCode() : 0);
        result = 31 * result + (resource != null ? resource.hashCode() : 0);
        result = 31 * result + (publicAccess != null ? publicAccess.hashCode() : 0);
        result = 31 * result + (loginAccess != null ? loginAccess.hashCode() : 0);
        result = 31 * result + (serviceName != null ? serviceName.hashCode() : 0);
        result = 31 * result + (objectVersionNumber != null ? objectVersionNumber.hashCode() : 0);
        return result;
    }
}
