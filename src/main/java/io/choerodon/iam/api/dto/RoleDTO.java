package io.choerodon.iam.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.validator.ResourceLevelValidator;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.util.StringUtils;

import javax.validation.constraints.Size;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author superlee
 */
public class RoleDTO {
    private static final String CODE_REGULAR_EXPRESSION
            = "^[a-z]([-a-z0-9]*[a-z0-9])$";

    private Long id;
    @NotEmpty(message = "error.role.name.empty")
    @Size(min = 1, max = 64)
    private String name;
    @NotEmpty(message = "error.role.code.empty")
    @Size(min = 1, max = 128)
    private String code;
    private String description;
    @NotEmpty(message = "error.role.level.empty")
    private String level;
    private Boolean enabled;
    private Boolean modified;
    private Boolean enableForbidden;
    private Boolean builtIn;
    private Boolean assignable;
    private Long objectVersionNumber;
    private Integer userCount;
    private List<PermissionDTO> permissions;
    private List<RolePermissionDTO> rolePermissions;
    private List<LabelDTO> labels;

    private List<UserDTO> users;

    @JsonIgnore
    private String param;

    private List<Long> roleIds;

    public List<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(List<UserDTO> users) {
        this.users = users;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }

    public List<RolePermissionDTO> getRolePermissions() {
        return rolePermissions;
    }

    public void setRolePermissions(List<RolePermissionDTO> rolePermissions) {
        this.rolePermissions = rolePermissions;
    }

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

    public Boolean getAssignable() {
        return assignable;
    }

    public void setAssignable(Boolean assignable) {
        this.assignable = assignable;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }

    public Integer getUserCount() {
        return userCount;
    }

    public void setUserCount(Integer userCount) {
        this.userCount = userCount;
    }

    public List<LabelDTO> getLabels() {
        return labels;
    }

    public void setLabels(List<LabelDTO> labels) {
        this.labels = labels;
    }


    public void updateCheck() {
        checkName();
        ResourceLevelValidator.validate(this.level);
        checkCode();
        checkObjectVersionNumber();
        checkRolePermission(this.permissions);
    }

    private void checkName() {
        if (StringUtils.isEmpty(this.name)) {
            throw new CommonException("error.role.name.empty");
        }
        if (this.name.length() > 64) {
            throw new CommonException("error.role.name.size");
        }
    }

    private void checkCode() {
        if (StringUtils.isEmpty(this.code)) {
            throw new CommonException("error.role.code.empty");
        }
        if (this.code.length() > 128) {
            throw new CommonException("error.role.code.length");
        }
        String[] codes = code.split("/");
        String lastCode = codes[codes.length - 1];
        Pattern p = Pattern.compile(CODE_REGULAR_EXPRESSION);
        Matcher m = p.matcher(lastCode);
        boolean isCheck = m.matches();
        if (!isCheck) {
            throw new CommonException("error.role.code.regular.illegal");
        }
    }

    private void checkObjectVersionNumber() {
        if (this.objectVersionNumber == null) {
            throw new CommonException("error.role.objectVersionNumber.empty");
        }
    }

    public void insertCheck() {
        ResourceLevelValidator.validate(this.level);
        checkCode();
        checkRolePermission(this.getPermissions());
    }

    private void checkRolePermission(List<PermissionDTO> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            throw new CommonException("error.role_permission.empty");
        }
    }
}
