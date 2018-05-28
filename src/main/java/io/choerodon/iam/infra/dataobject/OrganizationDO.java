package io.choerodon.iam.infra.dataobject;

import java.util.List;
import javax.persistence.*;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author wuguokai
 */
@ModifyAudit
@VersionAudit
@Table(name = "fd_organization")
public class OrganizationDO extends AuditDomain {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String code;

    @Column(name = "is_enabled")
    private Boolean enabled;

    @Transient
    private List<ProjectDO> projects;

    public OrganizationDO() {
    }

    public OrganizationDO(String name) {
        this.name = name;
    }

    public List<ProjectDO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDO> projects) {
        this.projects = projects;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
