//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//import io.choerodon.mybatis.domain.AuditDomain;
//
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
///**
// * @author zmf
// * @since 2018-10-15
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "IAM_SYSTEM_SETTING")
//public class SystemSettingDO extends AuditDomain {
//    @Id
//    @GeneratedValue
//    private Long id;
//
//    private String favicon;
//
//    private String systemLogo;
//
//    private String systemTitle;
//
//    private String systemName;
//
//    private String defaultPassword;
//
//    private String defaultLanguage;
//
//    private Integer minPasswordLength;
//
//    private Integer maxPasswordLength;
//
//    private Boolean registerEnabled;
//
//    private String registerUrl;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getFavicon() {
//        return favicon;
//    }
//
//    public void setFavicon(String favicon) {
//        this.favicon = favicon;
//    }
//
//    public String getSystemLogo() {
//        return systemLogo;
//    }
//
//    public void setSystemLogo(String systemLogo) {
//        this.systemLogo = systemLogo;
//    }
//
//    public String getSystemTitle() {
//        return systemTitle;
//    }
//
//    public void setSystemTitle(String systemTitle) {
//        this.systemTitle = systemTitle;
//    }
//
//    public String getSystemName() {
//        return systemName;
//    }
//
//    public void setSystemName(String systemName) {
//        this.systemName = systemName;
//    }
//
//    public String getDefaultPassword() {
//        return defaultPassword;
//    }
//
//    public void setDefaultPassword(String defaultPassword) {
//        this.defaultPassword = defaultPassword;
//    }
//
//    public String getDefaultLanguage() {
//        return defaultLanguage;
//    }
//
//    public void setDefaultLanguage(String defaultLanguage) {
//        this.defaultLanguage = defaultLanguage;
//    }
//
//    public Integer getMinPasswordLength() {
//        return minPasswordLength;
//    }
//
//    public void setMinPasswordLength(Integer minPasswordLength) {
//        this.minPasswordLength = minPasswordLength;
//    }
//
//    public Integer getMaxPasswordLength() {
//        return maxPasswordLength;
//    }
//
//    public void setMaxPasswordLength(Integer maxPasswordLength) {
//        this.maxPasswordLength = maxPasswordLength;
//    }
//
//    public Boolean getRegisterEnabled() {
//        return registerEnabled;
//    }
//
//    public void setRegisterEnabled(Boolean registerEnabled) {
//        this.registerEnabled = registerEnabled;
//    }
//
//    public String getRegisterUrl() {
//        return registerUrl;
//    }
//
//    public void setRegisterUrl(String registerUrl) {
//        this.registerUrl = registerUrl;
//    }
//}
