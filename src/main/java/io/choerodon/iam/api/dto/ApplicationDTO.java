package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;

/**
 * @author superlee
 * @since 0.15.0
 */
public class ApplicationDTO {

    private static final String CODE_REGULAR_EXPRESSION = "^[a-z]([-a-z0-9]*[a-z0-9])?$";

    private Long id;

    private Long organizationId;

    private Long projectId;

    @Length(min = 1, max = 20, message = "error.application.name.length")
    @NotEmpty(message = "error.application.name.empty")
    private String name;

    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.application.code.illegal")
    @NotEmpty(message = "error.application.code.empty")
    private String code;

    private Boolean enabled;

    @NotEmpty(message = "error.application.applicationCategory.empty")
    private String applicationCategory;

    @NotEmpty(message = "error.application.applicationType.empty")
    private String applicationType;

    private Long objectVersionNumber;

    private String param;

    public Long getId() {
        return id;
    }

    public ApplicationDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public ApplicationDTO setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
        return this;
    }

    public Long getProjectId() {
        return projectId;
    }

    public ApplicationDTO setProjectId(Long projectId) {
        this.projectId = projectId;
        return this;
    }

    public String getName() {
        return name;
    }

    public ApplicationDTO setName(String name) {
        this.name = name;
        return this;
    }

    public String getCode() {
        return code;
    }

    public ApplicationDTO setCode(String code) {
        this.code = code;
        return this;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public ApplicationDTO setEnabled(Boolean enabled) {
        this.enabled = enabled;
        return this;
    }

    public String getApplicationCategory() {
        return applicationCategory;
    }

    public ApplicationDTO setApplicationCategory(String applicationCategory) {
        this.applicationCategory = applicationCategory;
        return this;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public ApplicationDTO setApplicationType(String applicationType) {
        this.applicationType = applicationType;
        return this;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public ApplicationDTO setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
        return this;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    @Override
    public String toString() {
        return "ApplicationDTO{" +
                "id=" + id +
                ", organizationId=" + organizationId +
                ", projectId=" + projectId +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", enabled=" + enabled +
                ", applicationCategory='" + applicationCategory + '\'' +
                ", applicationType='" + applicationType + '\'' +
                ", objectVersionNumber=" + objectVersionNumber +
                ", param='" + param + '\'' +
                '}';
    }
}
