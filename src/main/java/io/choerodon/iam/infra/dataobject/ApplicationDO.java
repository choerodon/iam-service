package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

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
}
