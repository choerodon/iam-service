package io.choerodon.iam.infra.dataobject;

import java.util.Date;
import java.util.List;
import javax.persistence.*;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author wuguokai
 */

@ModifyAudit
@VersionAudit
@Table(name = "iam_user")
public class UserDO extends AuditDomain {

    @Id
    @GeneratedValue
    private Long id;
    private String loginName;
    private String email;
    private Long organizationId;
    @Transient
    private String originalPassword;
    private String password;
    private String realName;
    @Column(name = "international_tel_code")
    private String internationalTelCode;
    private String phone;
    private String imageUrl;
    private String profilePhoto;
    @Column(name = "is_enabled")
    private Boolean enabled;
    @Column(name = "is_ldap")
    private Boolean ldap;
    private String language;
    private String timeZone;
    private Date lastPasswordUpdatedAt;
    private Date lastLoginAt;

    @Transient
    private String uuid;
    /**
     * 连续登录错误次数超出规定次数后是否锁定账户
     */
    @Column(name = "is_locked")
    private Boolean locked;

    private Date lockedUntilAt;
    private Integer passwordAttempt;

    @Column(name = "is_admin")
    private Boolean admin;

    @Transient
    private Long sourceId;

    @Transient
    private List<RoleDO> roles;

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
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

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    public List<RoleDO> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleDO> roles) {
        this.roles = roles;
    }

    public String getOriginalPassword() {
        return originalPassword;
    }

    public void setOriginalPassword(String originalPassword) {
        this.originalPassword = originalPassword;
    }

    public String getInternationalTelCode() {
        return internationalTelCode;
    }

    public void setInternationalTelCode(String internationalTelCode) {
        this.internationalTelCode = internationalTelCode;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public UserDO() {
    }


    public UserDO(String loginName, String email, Long organizationId, String password, String realName, Boolean enabled,
                  String language, String timeZone, Date lastPasswordUpdatedAt, Boolean locked) {
        this.loginName = loginName;
        this.email = email;
        this.organizationId = organizationId;
        this.password = password;
        this.realName = realName;
        this.enabled = enabled;
        this.language = language;
        this.timeZone = timeZone;
        this.lastPasswordUpdatedAt = lastPasswordUpdatedAt;
        this.locked = locked;
    }
}
