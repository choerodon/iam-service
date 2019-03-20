package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.*;

/**
 * @author superlee
 * @since 0.15.0
 */
@ModifyAudit
@VersionAudit
@Table(name = "iam_application")
public class ApplicationDO extends AuditDomain {

    @Id
    @GeneratedValue
    private Long id;

    private Long organizationId;

    private Long projectId;

    private String name;

    private String code;

    @Column(name = "is_enabled")
    private Boolean enabled;

    private String applicationCategory;

    private String applicationType;

    @Transient
    private Integer appCount;
    @Transient
    private String projectName;
    @Transient
    private String projectCode;
    @Transient
    private String imageUrl;

    public Long getId() {
        return id;
    }

    public ApplicationDO setId(Long id) {
        this.id = id;
        return this;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public ApplicationDO setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
        return this;
    }

    public Long getProjectId() {
        return projectId;
    }

    public ApplicationDO setProjectId(Long projectId) {
        this.projectId = projectId;
        return this;
    }

    public String getName() {
        return name;
    }

    public ApplicationDO setName(String name) {
        this.name = name;
        return this;
    }

    public String getCode() {
        return code;
    }

    public ApplicationDO setCode(String code) {
        this.code = code;
        return this;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public ApplicationDO setEnabled(Boolean enabled) {
        this.enabled = enabled;
        return this;
    }

    public String getApplicationCategory() {
        return applicationCategory;
    }

    public ApplicationDO setApplicationCategory(String applicationCategory) {
        this.applicationCategory = applicationCategory;
        return this;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public ApplicationDO setApplicationType(String applicationType) {
        this.applicationType = applicationType;
        return this;
    }

    public Integer getAppCount() {
        return appCount;
    }

    public ApplicationDO setAppCount(Integer appCount) {
        this.appCount = appCount;
        return this;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "ApplicationDO{" +
                "id=" + id +
                ", organizationId=" + organizationId +
                ", projectId=" + projectId +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", enabled=" + enabled +
                ", applicationCategory='" + applicationCategory + '\'' +
                ", applicationType='" + applicationType + '\'' +
                ", appCount=" + appCount +
                ", projectName='" + projectName + '\'' +
                ", projectCode='" + projectCode + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
