package io.choerodon.iam.infra.dataobject;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author wuguokai
 */
@ModifyAudit
@VersionAudit
@Table(name = "fd_project")
public class ProjectDO extends AuditDomain {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    private String code;

    private Long organizationId;

    private Boolean isEnabled;

    public ProjectDO() {
    }

    public ProjectDO(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }

    @Override
    public String toString() {
        return "ProjectDO{" + "id=" + id
                + ", name='" + name + '\''
                + ", code='" + code + '\''
                + ", organizationId=" + organizationId
                + ", isEnabled=" + isEnabled
                + '}';
    }
}
