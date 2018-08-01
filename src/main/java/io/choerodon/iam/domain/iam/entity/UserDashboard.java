package io.choerodon.iam.domain.iam.entity;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author dongfan117@gmail.com
 */
@ModifyAudit
@VersionAudit
@Table(name = "iam_user_dashboard")
public class UserDashboard extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    private Long userId;
    private Long dashboardId;
    @Column(name = "is_visible")
    private Boolean visible;
    private Integer sort;
    private String level;
    private Long sourceId;

    public UserDashboard() {
    }

    public UserDashboard(Long userId, String level, Long sourceId) {
        this.userId = userId;
        this.level = level;
        this.sourceId = sourceId;
    }
    public UserDashboard(Long dashboardId, Long userId, String level, Long sourceId) {
        this(userId,level,sourceId);
        this.dashboardId = dashboardId;
    }
    public UserDashboard(
            Long dashboardId,
            Long userId,
            String level,
            Long sourceId,
            Integer sort) {
        this(dashboardId,userId,level,sourceId);
        this.sort = sort;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDashboardId() {
        return dashboardId;
    }

    public void setDashboardId(Long dashboardId) {
        this.dashboardId = dashboardId;
    }

    public Boolean getVisible() {
        return visible;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }
}
