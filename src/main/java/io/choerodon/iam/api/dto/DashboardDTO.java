package io.choerodon.iam.api.dto;

import java.util.List;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author dongfan117@gmail.com
 */
public class DashboardDTO {
    @ApiModelProperty(value = "Dashboard ID/非必填")
    private Long id;
    @ApiModelProperty(value = "Dashboard编码/必填")
    @NotNull(message = "error.dashboard.code.null")
    private String code;
    @NotNull(message = "error.dashboard.name.null")
    @ApiModelProperty(value = "Dashboard名称/必填")
    private String name;
    @ApiModelProperty(value = "命名空间/非必填")
    private String namespace;
    @NotNull(message = "error.dashboard.title.null")
    @ApiModelProperty(value = "Dashboard标题/必填")
    private String title;
    @ApiModelProperty(value = "层级/非必填")
    private String level;
    @ApiModelProperty(value = "描述/非必填")
    private String description;
    @ApiModelProperty(value = "图标/必填")
    @NotNull(message = "error.dashboard.icon.null")
    private String icon;
    @ApiModelProperty(value = "顺序/非必填")
    private Integer sort;
    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;
    @ApiModelProperty(value = "角色ID 列表/非必填")
    private List<Long> roleIds;

    public DashboardDTO() {
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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }
}
