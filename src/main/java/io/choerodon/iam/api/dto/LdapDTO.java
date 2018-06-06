package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * @author wuguokai
 */
public class LdapDTO {

    public static final String GET_LOGIN_NAME_FIELD = "getLoginNameField";
    public static final String GET_REAL_NAME_FIELD = "getRealNameField";
    public static final String GET_EMAIL_FIELD = "getEmailField";
    public static final String GET_PASSWORD_FIELD = "getPasswordField";
    public static final String GET_PHONE_FIELD = "getPhoneField";

    private Long id;
    @NotEmpty(message = "error.ldap.name.empty")
    private String name;
    @NotNull(message = "error.ldap.organizationId.null")
    private Long organizationId;
    @NotEmpty(message = "error.ldap.serverAddress.empty")
    private String serverAddress;
    @NotEmpty(message = "error.ldap.port.empty")
    private String port;
    @NotEmpty(message = "error.ldap.account.empty")
    private String account;
    @NotEmpty(message = "error.ldap.password.empty")
    private String password;
    private Boolean useSSL;
    private Boolean enabled;
    private Boolean syncing;
    private String baseDn;
    private String directoryType;
    @NotEmpty(message = "error.ldap.objectClass.empty")
    private String objectClass;
    private String loginNameField;
    private String realNameField;
    private String emailField;
    private String passwordField;
    private String phoneField;
    private Long totalSyncCount;
    private Date syncBeginTime;
    private Long objectVersionNumber;

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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getObjectClass() {
        return objectClass;
    }

    public void setObjectClass(String objectClass) {
        this.objectClass = objectClass;
    }
}
