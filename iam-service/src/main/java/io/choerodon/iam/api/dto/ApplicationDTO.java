//package io.choerodon.iam.api.dto;
//
//import io.swagger.annotations.ApiModelProperty;
//import org.hibernate.validator.constraints.Length;
//
//import javax.validation.constraints.NotEmpty;
//import javax.validation.constraints.Pattern;
//
///**
// * @author superlee
// * @since 0.15.0
// */
//public class ApplicationDTO {
//
//    private static final String CODE_REGULAR_EXPRESSION = "^[a-z]([-a-z0-9]*[a-z0-9])?$";
//
//    private Long id;
//
//    private Long organizationId;
//
//    private Long projectId;
//
//    @Length(min = 1, max = 20, message = "error.application.name.length")
//    @NotEmpty(message = "error.application.name.empty")
//    private String name;
//
//    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.application.code.illegal")
//    @NotEmpty(message = "error.application.code.empty")
//    private String code;
//
//    private Boolean enabled;
//
//    @NotEmpty(message = "error.application.applicationCategory.empty")
//    private String applicationCategory;
//
//    @NotEmpty(message = "error.application.applicationType.empty")
//    private String applicationType;
//
//    private Integer appCount;
//
//    private Long objectVersionNumber;
//
//    private String param;
//
//    @ApiModelProperty(value = "发送saga事件，标记从哪里调用的")
//    private String from;
//
//    private String projectName;
//
//    private String projectCode;
//
//    private String imageUrl;
//
//    public Long getId() {
//        return id;
//    }
//
//    public ApplicationDTO setId(Long id) {
//        this.id = id;
//        return this;
//    }
//
//    public Long getOrganizationId() {
//        return organizationId;
//    }
//
//    public ApplicationDTO setOrganizationId(Long organizationId) {
//        this.organizationId = organizationId;
//        return this;
//    }
//
//    public Long getProjectId() {
//        return projectId;
//    }
//
//    public ApplicationDTO setProjectId(Long projectId) {
//        this.projectId = projectId;
//        return this;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public ApplicationDTO setName(String name) {
//        this.name = name;
//        return this;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public ApplicationDTO setCode(String code) {
//        this.code = code;
//        return this;
//    }
//
//    public Boolean getEnabled() {
//        return enabled;
//    }
//
//    public ApplicationDTO setEnabled(Boolean enabled) {
//        this.enabled = enabled;
//        return this;
//    }
//
//    public String getApplicationCategory() {
//        return applicationCategory;
//    }
//
//    public ApplicationDTO setApplicationCategory(String applicationCategory) {
//        this.applicationCategory = applicationCategory;
//        return this;
//    }
//
//    public String getApplicationType() {
//        return applicationType;
//    }
//
//    public ApplicationDTO setApplicationType(String applicationType) {
//        this.applicationType = applicationType;
//        return this;
//    }
//
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public ApplicationDTO setObjectVersionNumber(Long objectVersionNumber) {
//        this.objectVersionNumber = objectVersionNumber;
//        return this;
//    }
//
//    public String getParam() {
//        return param;
//    }
//
//    public ApplicationDTO setParam(String param) {
//        this.param = param;
//        return this;
//    }
//
//    public Integer getAppCount() {
//        return appCount;
//    }
//
//    public void setAppCount(Integer appCount) {
//        this.appCount = appCount;
//    }
//
//    public String getFrom() {
//        return from;
//    }
//
//    public void setFrom(String from) {
//        this.from = from;
//    }
//
//    public String getProjectName() {
//        return projectName;
//    }
//
//    public void setProjectName(String projectName) {
//        this.projectName = projectName;
//    }
//
//    public String getProjectCode() {
//        return projectCode;
//    }
//
//    public void setProjectCode(String projectCode) {
//        this.projectCode = projectCode;
//    }
//
//    public String getImageUrl() {
//        return imageUrl;
//    }
//
//    public void setImageUrl(String imageUrl) {
//        this.imageUrl = imageUrl;
//    }
//
//    @Override
//    public String toString() {
//        return "ApplicationDTO{" +
//                "id=" + id +
//                ", organizationId=" + organizationId +
//                ", projectId=" + projectId +
//                ", name='" + name + '\'' +
//                ", code='" + code + '\'' +
//                ", enabled=" + enabled +
//                ", applicationCategory='" + applicationCategory + '\'' +
//                ", applicationType='" + applicationType + '\'' +
//                ", appCount=" + appCount +
//                ", objectVersionNumber=" + objectVersionNumber +
//                ", param='" + param + '\'' +
//                ", from='" + from + '\'' +
//                ", projectName='" + projectName + '\'' +
//                ", projectCode='" + projectCode + '\'' +
//                ", imageUrl='" + imageUrl + '\'' +
//                '}';
//    }
//}
