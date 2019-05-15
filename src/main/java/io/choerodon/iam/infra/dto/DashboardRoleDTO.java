package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "IAM_DASHBOARD_ROLE")
public class DashboardRoleDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dashboardCode;
    private String roleCode;

    @Transient
    @ApiModelProperty(value = "角色名")
    private String name;

    @Transient
    @ApiModelProperty(value = "角色编码")
    private String code;

    @Transient
    @ApiModelProperty(value = "角色描述")
    private String description;

    @Transient
    @ApiModelProperty(value = "角色层级")
    private String level;

    @Transient
    @ApiModelProperty(value = "是否启用")
    private Boolean enabled;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDashboardCode() {
        return dashboardCode;
    }

    public void setDashboardCode(String dashboardCode) {
        this.dashboardCode = dashboardCode;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
