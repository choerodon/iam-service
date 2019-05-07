package io.choerodon.iam.infra.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.choerodon.iam.api.validator.UserValidator;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.util.Date;
import java.util.List;

/**
 * @author superlee
 * @since 2019-04-21
 */
@Table(name = "iam_user")
public class UserDTO extends BaseDTO {

    public static final String EMAIL_REG = "[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?";

    public static final String PHONE_REG = "^((13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8})?$";

    public static final String LOGIN_NAME_REG = "^(?!\\-)[a-zA-Z0-9\\_\\-\\.]+(?<!\\.git|\\.atom|\\.)$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @ApiModelProperty(value = "登录名/必填")
    @Pattern(regexp = LOGIN_NAME_REG, message = "error.user.loginName.regex")
    private String loginName;

    @ApiModelProperty(value = "邮箱/必填")
    @Pattern(regexp = EMAIL_REG, message = "error.user.email.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    @NotEmpty(message = "error.user.email.empty",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String email;

    @ApiModelProperty(value = "组织ID/非必填")
    private Long organizationId;
    @Transient
    private String originalPassword;

    @ApiModelProperty(value = "密码")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "hash_password")
    private String password;

    @ApiModelProperty(value = "用户名/必填")
    @NotEmpty(groups = UserValidator.UserGroup.class)
    private String realName;

    @ApiModelProperty(value = "国际电话区号/非必填")
    private String internationalTelCode;

    @ApiModelProperty(value = "手机号/非必填")
    @Pattern(regexp = PHONE_REG, message = "error.phone.illegal",
            groups = {UserValidator.UserGroup.class, UserValidator.UserInfoGroup.class})
    private String phone;

    @ApiModelProperty(value = "头像/非必填")
    private String imageUrl;
    private String profilePhoto;

    @ApiModelProperty(value = "是否启用/非必填")
    @Column(name = "is_enabled")
    private Boolean enabled;

    @ApiModelProperty(value = "是否是LDAP用户/非必填")
    @Column(name = "is_ldap")
    private Boolean ldap;

    @ApiModelProperty(value = "语言/非必填")
    private String language;

    @ApiModelProperty(value = "时区/非必填")
    private String timeZone;
    private Date lastPasswordUpdatedAt;
    private Date lastLoginAt;

    @Transient
    @ApiModelProperty(value = "组织名称/非必填")
    private String organizationName;

    /**
     * 只用于返回该数据，不读入
     */
    @Transient
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String organizationCode;

    @Transient
    private String uuid;
    /**
     * 连续登录错误次数超出规定次数后是否锁定账户
     */
    @Column(name = "is_locked")
    @ApiModelProperty(value = "是否被锁定/非必填")
    private Boolean locked;

    private Date lockedUntilAt;
    private Integer passwordAttempt;

    @ApiModelProperty(value = "是否是ROOT用户/非必填")
    @Column(name = "is_admin")
    private Boolean admin;

    @Transient
    private Long sourceId;

    @Transient
    private List<RoleDTO> roles;

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

    public String getOriginalPassword() {
        return originalPassword;
    }

    public void setOriginalPassword(String originalPassword) {
        this.originalPassword = originalPassword;
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

    public String getInternationalTelCode() {
        return internationalTelCode;
    }

    public void setInternationalTelCode(String internationalTelCode) {
        this.internationalTelCode = internationalTelCode;
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

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getLdap() {
        return ldap;
    }

    public void setLdap(Boolean ldap) {
        this.ldap = ldap;
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

    public Date getLastPasswordUpdatedAt() {
        return lastPasswordUpdatedAt;
    }

    public void setLastPasswordUpdatedAt(Date lastPasswordUpdatedAt) {
        this.lastPasswordUpdatedAt = lastPasswordUpdatedAt;
    }

    public Date getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(Date lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getOrganizationCode() {
        return organizationCode;
    }

    public void setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public Date getLockedUntilAt() {
        return lockedUntilAt;
    }

    public void setLockedUntilAt(Date lockedUntilAt) {
        this.lockedUntilAt = lockedUntilAt;
    }

    public Integer getPasswordAttempt() {
        return passwordAttempt;
    }

    public void setPasswordAttempt(Integer passwordAttempt) {
        this.passwordAttempt = passwordAttempt;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public List<RoleDTO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDTO> roles) {
        this.roles = roles;
    }
}
