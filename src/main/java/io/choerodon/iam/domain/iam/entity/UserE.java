package io.choerodon.iam.domain.iam.entity;

import java.util.Date;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * @author dongfan117@gmail.com
 * @author superleader8@gamial.com
 */
public class UserE {

    //线程安全的，放心用。
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private Long id;

    private String loginName;

    private String email;

    private Long organizationId;

    private String password;

    private String realName;

    private String phone;

    private String imageUrl;

    private String profilePhoto;

    private String language;

    private String timeZone;

    private Date lastPasswordUpdatedAt;

    private Date lastLoginAt;

    private Boolean enabled;

    private Boolean locked;

    private Boolean ldap;

    private Date lockedUntilAt;

    private Integer passwordAttempt;

    private Long objectVersionNumber;

    private Boolean isDefault;

    private List<RoleE> roles;

    public UserE(String password) {
        this.password = password;
    }

    public UserE(Long id, String loginName, String email, String realName,
                 String phone, String imageUrl, String language, String timeZone,
                 Long objectVersionNumber, Boolean isDefault) {
        this.id = id;
        this.loginName = loginName;
        this.email = email;
        this.realName = realName;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.language = language;
        this.timeZone = timeZone;
        this.objectVersionNumber = objectVersionNumber;
        this.isDefault = isDefault;
    }

    public UserE(Long id, String loginName, String email, Long organizationId,
                 String password, String realName,
                 String phone, String imageUrl, String profilePhoto,
                 String language, String timeZone, Date lastPasswordUpdatedAt,
                 Date lastLoginAt, Boolean enabled, Boolean locked, Boolean ldap,
                 Date lockedUntilAt, Integer passwordAttempt,
                 Long objectVersionNumber, Boolean isDefault) {
        this.id = id;
        this.loginName = loginName;
        this.email = email;
        this.organizationId = organizationId;
        this.password = password;
        this.realName = realName;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.profilePhoto = profilePhoto;
        this.language = language;
        this.timeZone = timeZone;
        this.lastPasswordUpdatedAt = lastPasswordUpdatedAt;
        this.lastLoginAt = lastLoginAt;
        this.enabled = enabled;
        this.locked = locked;
        this.ldap = ldap;
        this.lockedUntilAt = lockedUntilAt;
        this.passwordAttempt = passwordAttempt;
        this.objectVersionNumber = objectVersionNumber;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return id;
    }

    public String getLoginName() {
        return loginName;
    }

    public String getEmail() {
        return email;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public String getPassword() {
        return password;
    }

    public String getRealName() {
        return realName;
    }

    public String getPhone() {
        return phone;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public Date getLastPasswordUpdatedAt() {
        return lastPasswordUpdatedAt;
    }

    public Date getLastLoginAt() {
        return lastLoginAt;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public Boolean getLocked() {
        return locked;
    }

    public Boolean getLdap() {
        return ldap;
    }

    public Date getLockedUntilAt() {
        return lockedUntilAt;
    }

    public Integer getPasswordAttempt() {
        return passwordAttempt;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void unlocked() {
        this.locked = false;
    }

    public void locked() {
        this.locked = true;
    }

    public void lockUtilAt(Date date) {
        this.lockedUntilAt = date;
    }

    public void encodePassword() {
        this.password = ENCODER.encode(this.getPassword());
    }

    public List<RoleE> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleE> roles) {
        this.roles = roles;
    }

    public void enable() {
        this.enabled = true;
    }

    public void disable() {
        this.enabled = false;
    }

    public UserE hiddenPassword() {
        this.password = null;
        return this;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public Boolean comparePassword(String originalPassword) {
        return ENCODER.matches(originalPassword, this.password);
    }

    public void resetPassword(String password) {
        this.password = ENCODER.encode(password);
    }

    public void becomeDefaultUser() {
        this.isDefault = true;
    }

    public void becomeNotDefaultUser() {
        this.isDefault = false;
    }
}
