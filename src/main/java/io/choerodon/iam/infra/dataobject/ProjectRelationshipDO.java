package io.choerodon.iam.infra.dataobject;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author Eugen
 */
@ModifyAudit
@VersionAudit
@Table(name = "fd_project_relationship")
public class ProjectRelationshipDO extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    private Long projectId;
    private Long parentId;
    private Date startDate;
    private Date endDate;
    @Column(name = "is_enabled")
    private Boolean enabled;
    private Long programId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    @Override
    public String toString() {
        return "ProjectRelationshipDO{" +
                "id=" + id +
                ", projectId=" + projectId +
                ", parentId=" + parentId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", enabled=" + enabled +
                ", programId=" + programId +
                '}';
    }
}
