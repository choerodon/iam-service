package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author zmf
 * @since 2018-10-15
 */
@ModifyAudit
@VersionAudit
@Table(name = "IAM_SYSTEM_SETTING")
public class SystemSettingDO extends AuditDomain {
    @Id
    @GeneratedValue
    @Column(name = "ID")
    private Long id;

    @Column(name = "FAVICON")
    private String favicon;

    @Column(name = "SYSTEM_LOGO")
    private String systemLogo;

    @Column(name = "SYSTEM_TITLE")
    private String systemTitle;

    @Column(name = "SYSTEM_NAME")
    private String systemName;

    @Column(name = "DEFAULT_PASSWORD")
    private String defaultPassword;

    @Column(name = "DEFAULT_LANGUAGE")
    private String defaultLanguage;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFavicon() {
        return favicon;
    }

    public void setFavicon(String favicon) {
        this.favicon = favicon;
    }

    public String getSystemLogo() {
        return systemLogo;
    }

    public void setSystemLogo(String systemLogo) {
        this.systemLogo = systemLogo;
    }

    public String getSystemTitle() {
        return systemTitle;
    }

    public void setSystemTitle(String systemTitle) {
        this.systemTitle = systemTitle;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getDefaultPassword() {
        return defaultPassword;
    }

    public void setDefaultPassword(String defaultPassword) {
        this.defaultPassword = defaultPassword;
    }

    public String getDefaultLanguage() {
        return defaultLanguage;
    }

    public void setDefaultLanguage(String defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    }
}
