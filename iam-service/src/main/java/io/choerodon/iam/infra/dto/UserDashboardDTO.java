package io.choerodon.iam.infra.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "IAM_USER_DASHBOARD")
public class UserDashboardDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "主键ID")
    private Long id;

    @ApiModelProperty(value = "用户ID")
    private Long userId;

    @NotNull(message = "error.dashboard.id.null")
    private Long dashboardId;

    @Column(name = "IS_VISIBLE")
    @ApiModelProperty(value = "是否可见")
    private Boolean visible;

    @ApiModelProperty(value = "排序/必填")
    @NotNull(message = "error.dashboard.sort.null")
    private Integer sort;

    @Column(name = "FD_LEVEL")
    @ApiModelProperty(value = "层级")
    private String level;

    @ApiModelProperty(value = "来源ID，与层级对应")
    private Long sourceId;

    @JsonIgnore
    private String position;

    @Transient
    private String dashboardCode;
    @Transient
    private String dashboardName;
    @Transient
    private String dashboardTitle;
    @Transient
    private String dashboardNamespace;
    @Transient
    private String dashboardDescription;
    @Transient
    private String dashboardIcon;

    @ApiModelProperty("卡片位置、宽高")
    @Transient
    private DashboardPositionDTO positionDTO;

    @Transient
    private Boolean needRoles;

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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
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

    public DashboardPositionDTO getPositionDTO() {
        return positionDTO;
    }

    public void setPositionDTO(DashboardPositionDTO positionDTO) {
        this.positionDTO = positionDTO;
    }

    public Boolean getNeedRoles() {
        return needRoles;
    }

    public void setNeedRoles(Boolean needRoles) {
        this.needRoles = needRoles;
    }
}
