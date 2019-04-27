package io.choerodon.iam.api.dto.test;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.api.validator.UserValidator;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * @author dengyouquan
 **/
public class UserDTO {
    public static final String EMAIL_REGULAR_EXPRESSION = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?";

    public static final String PHONE_REGULAR_EXPRESSION = "^((13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8})?$";

    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @ApiModelProperty(value = "组织ID/非必填")
    private Long organizationId;

    @ApiModelProperty(value = "组织名称/非必填")
    private String organizationName;

    @ApiModelProperty(value = "登录名/必填")
    @NotEmpty(message = "error.user.login_name.empty", groups = UserValidator.UserGroup.class)
    @Size(min = 1, max = 128, message = "error.user.login_name.size", groups = UserValidator.UserGroup.class)
    private String loginName;

    @ApiModelProperty(value = "邮箱/必填")
    @Pattern(regexp = EMAIL_REGULAR_EXPRESSION, message = "error.user.email.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    @NotEmpty(message = "error.user.email.empty",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String email;

    @ApiModelProperty(value = "用户名/必填")
    @NotEmpty(groups = UserValidator.UserGroup.class)
    private String realName;

    @ApiModelProperty(value = "手机号/非必填")
    @Pattern(regexp = PHONE_REGULAR_EXPRESSION, message = "error.phone.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String phone;

    @ApiModelProperty(value = "头像/非必填")
    private String imageUrl;

    @ApiModelProperty(value = "语言/非必填")
    private String language;

    @ApiModelProperty(value = "时区/非必填")
    private String timeZone;

    @ApiModelProperty(value = "是否被锁定/非必填")
    private Boolean locked;

    @ApiModelProperty(value = "是否是LDAP用户/非必填")
    private Boolean ldap;

    @ApiModelProperty(value = "是否启用/非必填")
    private Boolean enabled;

    @ApiModelProperty(value = "密码")
    private String password;

    @ApiModelProperty(value = "是否是ROOT用户/非必填")
    private Boolean admin;
    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;

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

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
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
}
