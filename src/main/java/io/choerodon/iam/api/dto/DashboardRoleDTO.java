package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author dongfan117@gmail.com
 */
public class DashboardRoleDTO {
    @ApiModelProperty(value = "ID/非必填")
    Long id;
    @ApiModelProperty(value = "Dashboard ID/必填")
    Long dashboardId;
    @ApiModelProperty(value = "角色Id")
    Long roleId;
    @ApiModelProperty(value = "角色名")
    private String name;
    @ApiModelProperty(value = "角色编码")
    private String code;
    @ApiModelProperty(value = "角色描述")
    private String description;
    @ApiModelProperty(value = "角色层级")
    private String level;
    @ApiModelProperty(value = "是否启用")
    private Boolean enabled;

    public DashboardRoleDTO() {
    }

    public DashboardRoleDTO(Long id, Long dashboardId, Long roleId, String name, String code, String description, String level, Boolean enabled) {
        this.id = id;
        this.dashboardId = dashboardId;
        this.roleId = roleId;
        this.name = name;
        this.code = code;
        this.description = description;
        this.level = level;
        this.enabled = enabled;
    }
}
