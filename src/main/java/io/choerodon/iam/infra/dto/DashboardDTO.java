package io.choerodon.iam.infra.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.iam.api.dto.DashboardPositionDTO;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author superlee
 * @since 2019-04-23
 */
@MultiLanguage
@Table(name = "IAM_DASHBOARD")
public class DashboardDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "Dashboard ID/非必填")
    private Long id;

    @ApiModelProperty(value = "Dashboard编码/必填")
    @NotNull(message = "error.dashboard.code.null")
    private String code;

    @MultiLanguageField
    @NotNull(message = "error.dashboard.name.null")
    @ApiModelProperty(value = "Dashboard名称/必填")
    private String name;

    @NotNull(message = "error.dashboard.title.null")
    @ApiModelProperty(value = "Dashboard标题/必填")
    private String title;

    @ApiModelProperty(value = "命名空间/非必填")
    private String namespace;

    @Column(name = "FD_LEVEL")
    @ApiModelProperty(value = "层级/非必填")
    private String level;

    @ApiModelProperty(value = "描述/非必填")
    private String description;

    @ApiModelProperty(value = "图标/必填")
    @NotNull(message = "error.dashboard.icon.null")
    private String icon;

    @ApiModelProperty(value = "顺序/非必填")
    private Integer sort;

    @ApiModelProperty(value = "是否需要角色控制/非必填")
    private Boolean needRoles;

    @Column(name = "IS_ENABLED")
    @ApiModelProperty(value = "是否启用/非必填")
    private Boolean enabled;

    @Transient
    @ApiModelProperty(value = "角色ID 列表/非必填")
    private List<String> roles;

    @JsonIgnore
    private String position;

    @Transient
    @ApiModelProperty("卡片默认位置、宽高")
    private DashboardPositionDTO positionDTO;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Boolean getNeedRoles() {
        return needRoles;
    }

    public void setNeedRoles(Boolean needRoles) {
        this.needRoles = needRoles;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public DashboardPositionDTO getPositionDTO() {
        return positionDTO;
    }

    public void setPositionDTO(DashboardPositionDTO positionDTO) {
        this.positionDTO = positionDTO;
    }
}
