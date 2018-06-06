package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @author wuguokai
 */
@VersionAudit
@ModifyAudit
@Table(name = "oauth_ldap")
public class LdapDO extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private Long organizationId;
    private String serverAddress;
    private String port;
    private String account;
    private String password;
    @Column(name = "use_ssl")
    private Boolean useSSL;
    @Column(name = "is_enabled")
    private Boolean enabled;
    @Column(name = "is_syncing")
    private Boolean syncing;
    private String baseDn;
    private String directoryType;
    private String objectClass;
    private String loginNameField;
    private String realNameField;
    private String emailField;
    private String passwordField;
    private String phoneField;
    private Long totalSyncCount;
    private Date syncBeginTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getServerAddress() {
        return serverAddress;
    }

    public void setServerAddress(String serverAddress) {
        this.serverAddress = serverAddress;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public Boolean getUseSSL() {
        return useSSL;
    }

    public void setUseSSL(Boolean useSSL) {
        this.useSSL = useSSL;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getSyncing() {
        return syncing;
    }

    public void setSyncing(Boolean syncing) {
        this.syncing = syncing;
    }

    public String getBaseDn() {
        return baseDn;
    }

    public void setBaseDn(String baseDn) {
        this.baseDn = baseDn;
    }

    public String getDirectoryType() {
        return directoryType;
    }

    public void setDirectoryType(String directoryType) {
        this.directoryType = directoryType;
    }

    public String getLoginNameField() {
        return loginNameField;
    }

    public void setLoginNameField(String loginNameField) {
        this.loginNameField = loginNameField;
    }

    public String getRealNameField() {
        return realNameField;
    }

    public void setRealNameField(String realNameField) {
        this.realNameField = realNameField;
    }

    public String getEmailField() {
        return emailField;
    }

    public void setEmailField(String emailField) {
        this.emailField = emailField;
    }

    public String getPasswordField() {
        return passwordField;
    }

    public void setPasswordField(String passwordField) {
        this.passwordField = passwordField;
    }

    public String getPhoneField() {
        return phoneField;
    }

    public void setPhoneField(String phoneField) {
        this.phoneField = phoneField;
    }

    public Long getTotalSyncCount() {
        return totalSyncCount;
    }

    public void setTotalSyncCount(Long totalSyncCount) {
        this.totalSyncCount = totalSyncCount;
    }

    public Date getSyncBeginTime() {
        return syncBeginTime;
    }

    public void setSyncBeginTime(Date syncBeginTime) {
        this.syncBeginTime = syncBeginTime;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getObjectClass() {
        return objectClass;
    }

    public void setObjectClass(String objectClass) {
        this.objectClass = objectClass;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LdapDO ldapDO = (LdapDO) o;

        if (!id.equals(ldapDO.id)) return false;
        if (!name.equals(ldapDO.name)) return false;
        if (!organizationId.equals(ldapDO.organizationId)) return false;
        if (!serverAddress.equals(ldapDO.serverAddress)) return false;
        if (!port.equals(ldapDO.port)) return false;
        if (account != null ? !account.equals(ldapDO.account) : ldapDO.account != null) return false;
        if (password != null ? !password.equals(ldapDO.password) : ldapDO.password != null) return false;
        if (!useSSL.equals(ldapDO.useSSL)) return false;
        if (!enabled.equals(ldapDO.enabled)) return false;
        if (!syncing.equals(ldapDO.syncing)) return false;
        if (baseDn != null ? !baseDn.equals(ldapDO.baseDn) : ldapDO.baseDn != null) return false;
        if (directoryType != null ? !directoryType.equals(ldapDO.directoryType) : ldapDO.directoryType != null)
            return false;
        if (!objectClass.equals(ldapDO.objectClass)) return false;
        if (loginNameField != null ? !loginNameField.equals(ldapDO.loginNameField) : ldapDO.loginNameField != null)
            return false;
        if (realNameField != null ? !realNameField.equals(ldapDO.realNameField) : ldapDO.realNameField != null)
            return false;
        if (emailField != null ? !emailField.equals(ldapDO.emailField) : ldapDO.emailField != null) return false;
        if (passwordField != null ? !passwordField.equals(ldapDO.passwordField) : ldapDO.passwordField != null)
            return false;
        if (phoneField != null ? !phoneField.equals(ldapDO.phoneField) : ldapDO.phoneField != null) return false;
        if (totalSyncCount != null ? !totalSyncCount.equals(ldapDO.totalSyncCount) : ldapDO.totalSyncCount != null)
            return false;
        return syncBeginTime != null ? syncBeginTime.equals(ldapDO.syncBeginTime) : ldapDO.syncBeginTime == null;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + name.hashCode();
        result = 31 * result + organizationId.hashCode();
        result = 31 * result + serverAddress.hashCode();
        result = 31 * result + port.hashCode();
        result = 31 * result + (account != null ? account.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + useSSL.hashCode();
        result = 31 * result + enabled.hashCode();
        result = 31 * result + syncing.hashCode();
        result = 31 * result + (baseDn != null ? baseDn.hashCode() : 0);
        result = 31 * result + (directoryType != null ? directoryType.hashCode() : 0);
        result = 31 * result + objectClass.hashCode();
        result = 31 * result + (loginNameField != null ? loginNameField.hashCode() : 0);
        result = 31 * result + (realNameField != null ? realNameField.hashCode() : 0);
        result = 31 * result + (emailField != null ? emailField.hashCode() : 0);
        result = 31 * result + (passwordField != null ? passwordField.hashCode() : 0);
        result = 31 * result + (phoneField != null ? phoneField.hashCode() : 0);
        result = 31 * result + (totalSyncCount != null ? totalSyncCount.hashCode() : 0);
        result = 31 * result + (syncBeginTime != null ? syncBeginTime.hashCode() : 0);
        return result;
    }
}
