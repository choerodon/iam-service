package io.choerodon.iam.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.validator.UserValidator;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author superlee
 * @data 2018/3/26
 */
public class UserDTO {

    private static final String EMAIL_REGULAR_EXPRESSION = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?";

    private static final String PHONE_REGULAR_EXPRESSION = "^((13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8})?$";

    private Long id;

    private Long organizationId;

    @NotEmpty(message = "error.user.login_name.empty", groups = UserValidator.UserGroup.class)
    @Size(min = 1, max = 128, message = "error.user.login_name.size", groups = UserValidator.UserGroup.class)
    private String loginName;

    @Pattern(regexp = EMAIL_REGULAR_EXPRESSION, message = "error.user.email.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    @NotEmpty(message = "error.user.email.empty",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String email;

    @NotEmpty(groups = UserValidator.UserGroup.class)
    private String realName;

    @Pattern(regexp = PHONE_REGULAR_EXPRESSION, message = "error.phone.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String phone;

    private String imageUrl;

    private String language;

    private String timeZone;

    private Boolean locked;

    private Boolean ldap;

    private Boolean enabled;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private Boolean admin;

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

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
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

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public void updateCheck() {
        if (this.id == null) {
            throw new CommonException("error.user.id.null");
        }
        if (this.objectVersionNumber == null) {
            throw new CommonException("error.user.objectVersionNumber.null");
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }
}
