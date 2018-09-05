package io.choerodon.iam.domain.iam.entity;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author dongfan117@gmail.com
 */
@ModifyAudit
@VersionAudit
@MultiLanguage
@Table(name = "IAM_DASHBOARD_ROLE")
public class DashboardRoleE extends AuditDomain {
    @Id
    @GeneratedValue
    Long id;
    Long dashboardId;
    long roleId;

    public DashboardRoleE() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(Long dashboardId) {
        this.dashboardId = dashboardId;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }
}
