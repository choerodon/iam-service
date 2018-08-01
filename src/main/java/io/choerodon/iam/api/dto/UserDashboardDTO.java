package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;

/**
 * @author dongfan117@gmail.com
 */
public class UserDashboardDTO {
    private Long id;
    private Long userId;
    private Boolean visible;
    @NotNull(message = "error.dashboard.sort.null")
    private Integer sort;
    private String level;
    private Long sourceId;
    private Long objectVersionNumber;

    // Dashboard
    @NotNull(message = "error.dashboardId.null")
    private Long dashboardId;
    private String dashboardCode;
    private String dashboardName;
    private String dashboardTitle;
    private String dashboardNamespace;
    private String dashboardDescription;
    private String dashboardIcon;

    public UserDashboardDTO() {
    }

    public UserDashboardDTO(Long id,
                            Long userId,
                            Long dashboardId,
                            Boolean visible,
                            Integer sort,
                            String level,
                            Long objectVersionNumber) {
        this.id = id;
        this.userId = userId;
        this.dashboardId = dashboardId;
        this.visible = visible;
        this.sort = sort;
        this.level = level;
        this.objectVersionNumber = objectVersionNumber;
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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getDashboardCode() {
        return dashboardCode;
    }

    public void setDashboardCode(String dashboardCode) {
        this.dashboardCode = dashboardCode;
    }

    public String getDashboardName() {
        return dashboardName;
    }

    public void setDashboardName(String dashboardName) {
        this.dashboardName = dashboardName;
    }

    public String getDashboardTitle() {
        return dashboardTitle;
    }

    public void setDashboardTitle(String dashboardTitle) {
        this.dashboardTitle = dashboardTitle;
    }

    public String getDashboardNamespace() {
        return dashboardNamespace;
    }

    public void setDashboardNamespace(String dashboardNamespace) {
        this.dashboardNamespace = dashboardNamespace;
    }

    public String getDashboardDescription() {
        return dashboardDescription;
    }

    public void setDashboardDescription(String dashboardDescription) {
        this.dashboardDescription = dashboardDescription;
    }

    public String getDashboardIcon() {
        return dashboardIcon;
    }

    public void setDashboardIcon(String dashboardIcon) {
        this.dashboardIcon = dashboardIcon;
    }
}
