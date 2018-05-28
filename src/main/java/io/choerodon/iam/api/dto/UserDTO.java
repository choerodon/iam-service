package io.choerodon.iam.api.dto;

import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 * @data 2018/3/26
 */
public class UserDTO {

    public static final String EMAIL_REGULAR_EXPRESSION = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?";

    public static final String PHONE_REGULAR_EXPRESSION = "^((13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8})?$";

    private Long id;

    @NotEmpty(message = "error.user.login_name.empty")
    @Size(min = 1, max = 128, message = "error.user.login_name.size")
    private String loginName;

    @Pattern(regexp = EMAIL_REGULAR_EXPRESSION, message = "error.user.email.illegal")
    @NotEmpty(message = "error.user.email.empty")
    private String email;

    @Pattern(regexp = PHONE_REGULAR_EXPRESSION, message = "error.phone.illegal")
    private String phone;

    private Long organizationId;

    private String password;

    @NotNull
    private String realName;

    private String language;

    private Boolean enabled;

    private Boolean locked;

    private Boolean ldap;

    private Long objectVersionNumber;

    private List<RoleDTO> roles;

    @JsonIgnore
    private String param;

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public Boolean getLdap() {
        return ldap;
    }

    public void setLdap(Boolean ldap) {
        this.ldap = ldap;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
