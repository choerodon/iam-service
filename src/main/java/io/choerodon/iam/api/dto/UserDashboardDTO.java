package io.choerodon.iam.api.dto;

/**
 * @author dongfan117@gmail.com
 */
public class UserDashboardDTO {
    private Long id;
    private Long userId;
    private Long dashboardId;
    private String visible;
    private Integer sort;
    private String level;
    private Long sourceId;
    private Long objectVersionNumber;

    public UserDashboardDTO() {
    }

    public UserDashboardDTO(Long id,
                            Long userId,
                            Long dashboardId,
                            String visible,
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

    public String getVisible() {
        return visible;
    }

    public void setVisible(String visible) {
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
}
