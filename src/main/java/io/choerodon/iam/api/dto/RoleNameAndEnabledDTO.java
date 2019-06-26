package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class RoleNameAndEnabledDTO {

    @ApiModelProperty(value = "角色名")
    private String name;

    @ApiModelProperty(value = "角色代码")
    private String code;

    @ApiModelProperty(value = "角色是否启用")
    private boolean enabled;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public RoleNameAndEnabledDTO(String code, String name, boolean enabled) {
        this.code = code;
        this.name = name;
        this.enabled = enabled;
    }

    public RoleNameAndEnabledDTO() {
    }
}
