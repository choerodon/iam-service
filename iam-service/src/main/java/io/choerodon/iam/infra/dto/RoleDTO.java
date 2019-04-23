package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author superlee
 * @since 2019-04-15
 */
@Table(name = "iam_role")
public class RoleDTO extends BaseDTO {

    private static final String CODE_REGULAR_EXPRESSION = "^[a-z]([-a-z0-9]*[a-z0-9])$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ApiModelProperty(value = "角色名/必填")
    @NotEmpty(message = "error.role.name.empty")
    @Size(min = 1, max = 64)
    private String name;

    @ApiModelProperty(value = "角色编码/必填")
    @NotEmpty(message = "error.role.code.empty")
    @Size(min = 1, max = 128)
    private String code;

    @ApiModelProperty(value = "角色描述/非必填")
    private String description;

    @ApiModelProperty(value = "角色层级/必填")
    @NotEmpty(message = "error.role.level.empty")
    private String resourceLevel;

    @ApiModelProperty(value = "是否启用/非必填")
    @Column(name = "is_enabled")
    private Boolean enabled;

    @ApiModelProperty(value = "是否允许修改/非必填")
    @Column(name = "is_modified")
    private Boolean modified;

    @ApiModelProperty(value = "是否允许禁用/非必填")
    @Column(name = "is_enable_forbidden")
    private Boolean enableForbidden;

    @ApiModelProperty(value = "是否内置角色/非必填")
    @Column(name = "is_built_in")
    private Boolean builtIn;

    @Transient
    private List<PermissionDTO> permissions;

    @Transient
    private List<LabelDTO> labels;

    @Transient
    private String organizationName;

    @Transient
    private String projectName;

    @Transient
    private List<UserDTO> users;

    @Transient
    @ApiModelProperty(value = "已分配用户数量/非必填")
    private Integer userCount;

    @Transient
    private List<Long> roleIds;

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

    public String getResourceLevel() {
        return resourceLevel;
    }

    public void setResourceLevel(String resourceLevel) {
        this.resourceLevel = resourceLevel;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getModified() {
        return modified;
    }

    public void setModified(Boolean modified) {
        this.modified = modified;
    }

    public Boolean getEnableForbidden() {
        return enableForbidden;
    }

    public void setEnableForbidden(Boolean enableForbidden) {
        this.enableForbidden = enableForbidden;
    }

    public Boolean getBuiltIn() {
        return builtIn;
    }

    public void setBuiltIn(Boolean builtIn) {
        this.builtIn = builtIn;
    }

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }

    public List<LabelDTO> getLabels() {
        return labels;
    }

    public void setLabels(List<LabelDTO> labels) {
        this.labels = labels;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public List<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserDTO> users) {
        this.users = users;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }
}
