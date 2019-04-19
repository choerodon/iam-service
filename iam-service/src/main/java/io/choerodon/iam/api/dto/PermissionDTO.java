//package io.choerodon.iam.api.dto;
//
//import io.swagger.annotations.ApiModelProperty;
//
///**
// * @author wuguokai
// */
//public class PermissionDTO {
//    @ApiModelProperty(value = "主键ID")
//    private Long id;
//    @ApiModelProperty(value = "权限编码")
//    private String code;
//    @ApiModelProperty(value = "权限路径")
//    private String path;
//    @ApiModelProperty(value = "接口方法")
//    private String method;
//    @ApiModelProperty(value = "权限层级")
//    private String level;
//    @ApiModelProperty(value = "权限描述")
//    private String description;
//    @ApiModelProperty(value = "方法action")
//    private String action;
//    @ApiModelProperty(value = "权限资源")
//    private String resource;
//    @ApiModelProperty(value = "是否公开权限")
//    private Boolean publicAccess;
//    @ApiModelProperty(value = "是否登录可访问")
//    private Boolean loginAccess;
//    @ApiModelProperty(value = "是否是内部接口")
//    private Boolean within;
//    @ApiModelProperty(value = "服务名")
//    private String serviceName;
//    @ApiModelProperty(value = "乐观锁版本号")
//    private Long objectVersionNumber;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
//
//    public String getPath() {
//        return path;
//    }
//
//    public void setPath(String path) {
//        this.path = path;
//    }
//
//    public String getMethod() {
//        return method;
//    }
//
//    public void setMethod(String method) {
//        this.method = method;
//    }
//
//    public String getLevel() {
//        return level;
//    }
//
//    public void setLevel(String level) {
//        this.level = level;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public String getAction() {
//        return action;
//    }
//
//    public void setAction(String action) {
//        this.action = action;
//    }
//
//    public String getResource() {
//        return resource;
//    }
//
//    public void setResource(String resource) {
//        this.resource = resource;
//    }
//
//    public Boolean getPublicAccess() {
//        return publicAccess;
//    }
//
//    public void setPublicAccess(Boolean publicAccess) {
//        this.publicAccess = publicAccess;
//    }
//
//    public Boolean getLoginAccess() {
//        return loginAccess;
//    }
//
//    public void setLoginAccess(Boolean loginAccess) {
//        this.loginAccess = loginAccess;
//    }
//
//    public Boolean getWithin() {
//        return within;
//    }
//
//    public void setWithin(Boolean within) {
//        this.within = within;
//    }
//
//    public String getServiceName() {
//        return serviceName;
//    }
//
//    public void setServiceName(String serviceName) {
//        this.serviceName = serviceName;
//    }
//
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public void setObjectVersionNumber(Long objectVersionNumber) {
//        this.objectVersionNumber = objectVersionNumber;
//    }
//
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//
//        PermissionDTO that = (PermissionDTO) o;
//
//        if (id != null ? !id.equals(that.id) : that.id != null) return false;
//        if (code != null ? !code.equals(that.code) : that.code != null) return false;
//        if (path != null ? !path.equals(that.path) : that.path != null) return false;
//        if (method != null ? !method.equals(that.method) : that.method != null) return false;
//        if (level != null ? !level.equals(that.level) : that.level != null) return false;
//        if (description != null ? !description.equals(that.description) : that.description != null) return false;
//        if (action != null ? !action.equals(that.action) : that.action != null) return false;
//        if (resource != null ? !resource.equals(that.resource) : that.resource != null) return false;
//        if (publicAccess != null ? !publicAccess.equals(that.publicAccess) : that.publicAccess != null) return false;
//        if (loginAccess != null ? !loginAccess.equals(that.loginAccess) : that.loginAccess != null) return false;
//        if (within != null ? !within.equals(that.within) : that.within != null) return false;
//        if (serviceName != null ? !serviceName.equals(that.serviceName) : that.serviceName != null) return false;
//        return objectVersionNumber != null ? objectVersionNumber.equals(that.objectVersionNumber) : that.objectVersionNumber == null;
//    }
//
//    @Override
//    public int hashCode() {
//        int result = id != null ? id.hashCode() : 0;
//        result = 31 * result + (code != null ? code.hashCode() : 0);
//        result = 31 * result + (path != null ? path.hashCode() : 0);
//        result = 31 * result + (method != null ? method.hashCode() : 0);
//        result = 31 * result + (level != null ? level.hashCode() : 0);
//        result = 31 * result + (description != null ? description.hashCode() : 0);
//        result = 31 * result + (action != null ? action.hashCode() : 0);
//        result = 31 * result + (resource != null ? resource.hashCode() : 0);
//        result = 31 * result + (publicAccess != null ? publicAccess.hashCode() : 0);
//        result = 31 * result + (loginAccess != null ? loginAccess.hashCode() : 0);
//        result = 31 * result + (within != null ? within.hashCode() : 0);
//        result = 31 * result + (serviceName != null ? serviceName.hashCode() : 0);
//        result = 31 * result + (objectVersionNumber != null ? objectVersionNumber.hashCode() : 0);
//        return result;
//    }
//}
