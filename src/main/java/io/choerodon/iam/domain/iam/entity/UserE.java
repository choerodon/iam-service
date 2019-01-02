package io.choerodon.iam.domain.iam.entity;

import java.util.Date;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * @author dongfan117@gmail.com
 * @author superleader8@gamial.com
 */
public class UserE {

    /**
     * 线程安全的，放心用
     */
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    private Long id;

    private String loginName;

    private String email;

    private Long organizationId;

    private String password;

    private String realName;

    private String internationalTelCode;

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

    private Long lastUpdatedBy;

    private Boolean admin;

    private List<RoleE> roles;

    public UserE() {}

    public UserE(String password) {
        this.password = password;
    }

    public UserE(Long id, String loginName, String email, String realName,
                 String phone, String imageUrl, String language, String timeZone,
                 Long objectVersionNumber, Boolean admin) {
        this.id = id;
        this.loginName = loginName;
        this.email = email;
        this.realName = realName;
        this.phone = phone;
        this.imageUrl = imageUrl;
        this.language = language;
        this.timeZone = timeZone;
        this.objectVersionNumber = objectVersionNumber;
        this.admin = admin;
    }

    public UserE(Long id, String loginName) {
        this.id = id;
        this.loginName = loginName;
    }

    public UserE(Long id, String loginName, String email, Long organizationId,
                 String password, String realName,
                 String phone, String imageUrl, String profilePhoto,
                 String language, String timeZone, Date lastPasswordUpdatedAt,
                 Date lastLoginAt, Boolean enabled, Boolean locked, Boolean ldap,
                 Date lockedUntilAt, Integer passwordAttempt,
                 Long objectVersionNumber, Boolean admin, String internationalTelCode) {
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
        this.admin = admin;
        this.internationalTelCode = internationalTelCode;
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

    public String getInternationalTelCode() {
        return internationalTelCode;
    }

    public void setInternationalTelCode(String internationalTelCode) {
        this.internationalTelCode = internationalTelCode;
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

    public Boolean getAdmin() {
        return admin;
    }

    public Boolean comparePassword(String originalPassword) {
        return ENCODER.matches(originalPassword, this.password);
    }

    public void resetPassword(String password) {
        this.password = ENCODER.encode(password);
    }

    public void becomeAdminUser() {
        this.admin = true;
    }

    public void becomeNotAdminUser() {
        this.admin = false;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    public void setLastUpdatedBy(Long lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public void setLastPasswordUpdatedAt(Date lastPasswordUpdatedAt) {
        this.lastPasswordUpdatedAt = lastPasswordUpdatedAt;
    }

    public void setLastLoginAt(Date lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public void setLdap(Boolean ldap) {
        this.ldap = ldap;
    }

    public void setLockedUntilAt(Date lockedUntilAt) {
        this.lockedUntilAt = lockedUntilAt;
    }

    public void setPasswordAttempt(Integer passwordAttempt) {
        this.passwordAttempt = passwordAttempt;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

}
