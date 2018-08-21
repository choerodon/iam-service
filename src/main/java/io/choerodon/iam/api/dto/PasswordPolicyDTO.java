package io.choerodon.iam.api.dto;


import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

/**
 * @author wuguokai
 */
public class PasswordPolicyDTO {
    private Long id;
    @NotNull(message = "error.passwordPolicy.code.null")
    private String code;
    @NotNull(message = "error.passwordPolicy.name.null")
    private String name;
    @NotNull(message = "error.passwordPolicy.organizationId.null")
    private Long organizationId;
    private String originalPassword;
    @Range(min = 0, message = "error.minLength")
    private Integer minLength;
    @Range(min = 0, message = "error.maxLength")
    private Integer maxLength;
    private Integer maxErrorTime;
    @Range(min = 0, message = "error.digitsCount")
    private Integer digitsCount;
    @Range(min = 0, message = "error.lowercaseCount")
    private Integer lowercaseCount;
    @Range(min = 0, message = "error.uppercaseCount")
    private Integer uppercaseCount;
    @Range(min = 0, message = "error.specialCharCount")
    private Integer specialCharCount;
    private Boolean notUsername;
    private String regularExpression;
    @Range(min = 0, message = "error.notRecentCount")
    private Integer notRecentCount;
    private Boolean enablePassword;
    private Boolean enableSecurity;
    private Boolean enableLock;
    private Integer lockedExpireTime;
    private Boolean enableCaptcha;
    private Integer maxCheckCaptcha;
    private Long objectVersionNumber;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getMinLength() {
        return minLength;
    }

    public void setMinLength(Integer minLength) {
        this.minLength = minLength;
    }

    public Integer getMaxLength() {
        return maxLength;
    }

    public void setMaxLength(Integer maxLength) {
        this.maxLength = maxLength;
    }

    public Integer getMaxErrorTime() {
        return maxErrorTime;
    }

    public void setMaxErrorTime(Integer maxErrorTime) {
        this.maxErrorTime = maxErrorTime;
    }

    public Integer getDigitsCount() {
        return digitsCount;
    }

    public void setDigitsCount(Integer digitsCount) {
        this.digitsCount = digitsCount;
    }

    public Integer getLowercaseCount() {
        return lowercaseCount;
    }

    public void setLowercaseCount(Integer lowercaseCount) {
        this.lowercaseCount = lowercaseCount;
    }

    public Integer getUppercaseCount() {
        return uppercaseCount;
    }

    public void setUppercaseCount(Integer uppercaseCount) {
        this.uppercaseCount = uppercaseCount;
    }

    public Integer getSpecialCharCount() {
        return specialCharCount;
    }

    public void setSpecialCharCount(Integer specialCharCount) {
        this.specialCharCount = specialCharCount;
    }

    public Boolean getNotUsername() {
        return notUsername;
    }

    public void setNotUsername(Boolean notUsername) {
        this.notUsername = notUsername;
    }

    public String getRegularExpression() {
        return regularExpression;
    }

    public void setRegularExpression(String regularExpression) {
        this.regularExpression = regularExpression;
    }

    public Integer getNotRecentCount() {
        return notRecentCount;
    }

    public void setNotRecentCount(Integer notRecentCount) {
        this.notRecentCount = notRecentCount;
    }

    public String getOriginalPassword() {
        return originalPassword;
    }

    public void setOriginalPassword(String originalPassword) {
        this.originalPassword = originalPassword;
    }

    public Boolean getEnablePassword() {
        return enablePassword;
    }

    public void setEnablePassword(Boolean enablePassword) {
        this.enablePassword = enablePassword;
    }

    public Boolean getEnableSecurity() {
        return enableSecurity;
    }

    public void setEnableSecurity(Boolean enableSecurity) {
        this.enableSecurity = enableSecurity;
    }

    public Boolean getEnableLock() {
        return enableLock;
    }

    public void setEnableLock(Boolean enableLock) {
        this.enableLock = enableLock;
    }

    public Integer getLockedExpireTime() {
        return lockedExpireTime;
    }

    public void setLockedExpireTime(Integer lockedExpireTime) {
        this.lockedExpireTime = lockedExpireTime;
    }

    public Boolean getEnableCaptcha() {
        return enableCaptcha;
    }

    public void setEnableCaptcha(Boolean enableCaptcha) {
        this.enableCaptcha = enableCaptcha;
    }

    public Integer getMaxCheckCaptcha() {
        return maxCheckCaptcha;
    }

    public void setMaxCheckCaptcha(Integer maxCheckCaptcha) {
        this.maxCheckCaptcha = maxCheckCaptcha;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
