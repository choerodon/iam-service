package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class UserRoleDTO {

    @ApiModelProperty(value = "资源id")
    private Long id;

    @ApiModelProperty(value = "资源名")
    private String name;

    @ApiModelProperty(value = "资源编码")
    private String code;

    @ApiModelProperty(value = "层级")
    private String level;

    private Boolean isEnabled;

    @ApiModelProperty(value = "角色列表")
    private List<RoleDTO> roles;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
