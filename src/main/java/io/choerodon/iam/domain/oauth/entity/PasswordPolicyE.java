//package io.choerodon.iam.domain.oauth.entity;
//
///**
// * @author wuguokai
// */
//public class PasswordPolicyE {
//    private Long id;
//    private String code;
//    private String name;
//    private Long organizationId;
//    private String originalPassword;
//    private Integer minLength;
//    private Integer maxLength;
//    private Integer maxErrorTime;
//    private Integer digitsCount;
//    private Integer lowercaseCount;
//    private Integer uppercaseCount;
//    private Integer specialCharCount;
//    private Boolean notUsername;
//    private String regularExpression;
//    private Integer notRecentCount;
//    private Boolean enablePassword;
//    private Boolean enableSecurity;
//    private Boolean enableLock;
//    private Integer lockedExpireTime;
//    private Boolean enableCaptcha;
//    private Integer maxCheckCaptcha;
//    private Long objectVersionNumber;
//
//    private PasswordPolicyE() {
//    }
//
//    public PasswordPolicyE(Long id, String code, String name, Long organizationId, String originalPassword,
//                           Integer minLength, Integer maxLength, Integer maxErrorTime, Integer digitsCount,
//                           Integer lowercaseCount, Integer uppercaseCount, Integer specialCharCount,
//                           Boolean notUsername, String regularExpression, Integer notRecentCount,
//                           Boolean enablePassword, Boolean enableSecurity, Boolean enableLock,
//                           Integer lockedExpireTime, Boolean enableCaptcha, Integer maxCheckCaptcha,
//                           Long objectVersionNumber) {
//        this.id = id;
//        this.code = code;
//        this.name = name;
//        this.organizationId = organizationId;
//        this.originalPassword = originalPassword;
//        this.minLength = minLength;
//        this.maxLength = maxLength;
//        this.maxErrorTime = maxErrorTime;
//        this.digitsCount = digitsCount;
//        this.lowercaseCount = lowercaseCount;
//        this.uppercaseCount = uppercaseCount;
//        this.specialCharCount = specialCharCount;
//        this.notUsername = notUsername;
//        this.regularExpression = regularExpression;
//        this.notRecentCount = notRecentCount;
//        this.enablePassword = enablePassword;
//        this.enableSecurity = enableSecurity;
//        this.enableLock = enableLock;
//        this.lockedExpireTime = lockedExpireTime;
//        this.enableCaptcha = enableCaptcha;
//        this.maxCheckCaptcha = maxCheckCaptcha;
//        this.objectVersionNumber = objectVersionNumber;
//    }
//
//    public String getOriginalPassword() {
//        return originalPassword;
//    }
//
//    public void setOriginalPassword(String originalPassword) {
//        this.originalPassword = originalPassword;
//    }
//
//    public Boolean getEnablePassword() {
//        return enablePassword;
//    }
//
//    public void enablePassword() {
//        this.enablePassword = true;
//    }
//
//    public void disablePassword() {
//        this.enablePassword = false;
//    }
//
//    public Boolean getEnableSecurity() {
//        return enableSecurity;
//    }
//
//    public void enableSecurity() {
//        this.enableSecurity = true;
//    }
//
//    public void disableSecurity() {
//        this.enableSecurity = false;
//    }
//
//    public void enableLock() {
//        this.enableLock = true;
//    }
//
//    public void disableLock() {
//        this.enableLock = false;
//    }
//
//    public void enableCaptcha() {
//        this.enableCaptcha = true;
//    }
//
//    public void disableCaptcha() {
//        this.enableCaptcha = false;
//    }
//
//    public Long getOrganizationId() {
//        return organizationId;
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Integer getMinLength() {
//        return minLength;
//    }
//
//    public void setMinLength(Integer minLength) {
//        this.minLength = minLength;
//    }
//
//    public Integer getMaxLength() {
//        return maxLength;
//    }
//
//    public void setMaxLength(Integer maxLength) {
//        this.maxLength = maxLength;
//    }
//
//    public Integer getMaxErrorTime() {
//        return maxErrorTime;
//    }
//
//    public void setMaxErrorTime(Integer maxErrorTime) {
//        this.maxErrorTime = maxErrorTime;
//    }
//
//    public Integer getDigitsCount() {
//        return digitsCount;
//    }
//
//    public void setDigitsCount(Integer digitsCount) {
//        this.digitsCount = digitsCount;
//    }
//
//    public Integer getLowercaseCount() {
//        return lowercaseCount;
//    }
//
//    public void setLowercaseCount(Integer lowercaseCount) {
//        this.lowercaseCount = lowercaseCount;
//    }
//
//    public Integer getUppercaseCount() {
//        return uppercaseCount;
//    }
//
//    public void setUppercaseCount(Integer uppercaseCount) {
//        this.uppercaseCount = uppercaseCount;
//    }
//
//    public Integer getSpecialCharCount() {
//        return specialCharCount;
//    }
//
//    public void setSpecialCharCount(Integer specialCharCount) {
//        this.specialCharCount = specialCharCount;
//    }
//
//    public Boolean getNotUsername() {
//        return notUsername;
//    }
//
//    public void setNotUsername(Boolean notUsername) {
//        this.notUsername = notUsername;
//    }
//
//    public String getRegularExpression() {
//        return regularExpression;
//    }
//
//    public void setRegularExpression(String regularExpression) {
//        this.regularExpression = regularExpression;
//    }
//
//    public Integer getNotRecentCount() {
//        return notRecentCount;
//    }
//
//    public void setNotRecentCount(Integer notRecentCount) {
//        this.notRecentCount = notRecentCount;
//    }
//
//    public Boolean getEnableLock() {
//        return enableLock;
//    }
//
//    public Integer getLockedExpireTime() {
//        return lockedExpireTime;
//    }
//
//    public void setLockedExpireTime(Integer lockedExpireTime) {
//        this.lockedExpireTime = lockedExpireTime;
//    }
//
//    public Boolean getEnableCaptcha() {
//        return enableCaptcha;
//    }
//
//    public Integer getMaxCheckCaptcha() {
//        return maxCheckCaptcha;
//    }
//
//    public void setMaxCheckCaptcha(Integer maxCheckCaptcha) {
//        this.maxCheckCaptcha = maxCheckCaptcha;
//    }
//
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public void setObjectVersionNumber(Long objectVersionNumber) {
//        this.objectVersionNumber = objectVersionNumber;
//    }
//}
