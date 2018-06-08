package io.choerodon.iam.api.dto;


/**
 * @author superlee
 */
public class LdapConnectionDTO {
    private Boolean canConnectServer;
    private Boolean canLogin;
    private Boolean matchAttribute;
    private String loginNameField;
    private String realNameField;
    private String passwordField;
    private String phoneField;
    private String emailField;

    public Boolean getCanConnectServer() {
        return canConnectServer;
    }

    public void setCanConnectServer(Boolean canConnectServer) {
        this.canConnectServer = canConnectServer;
    }

    public Boolean getCanLogin() {
        return canLogin;
    }

    public void setCanLogin(Boolean canLogin) {
        this.canLogin = canLogin;
    }

    public Boolean getMatchAttribute() {
        return matchAttribute;
    }

    public void setMatchAttribute(Boolean matchAttribute) {
        this.matchAttribute = matchAttribute;
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

    public String getEmailField() {
        return emailField;
    }

    public void setEmailField(String emailField) {
        this.emailField = emailField;
    }

    public void fullFields(String key, String value) {
        if (LdapDTO.GET_LOGIN_NAME_FIELD.equals(key)) {
            this.setLoginNameField(value);
        }
        if (LdapDTO.GET_REAL_NAME_FIELD.equals(key)) {
            this.setRealNameField(value);
        }
        if (LdapDTO.GET_EMAIL_FIELD.equals(key)) {
            this.setEmailField(value);
        }
        if (LdapDTO.GET_PHONE_FIELD.equals(key)) {
            this.setPhoneField(value);
        }
    }
}
