package io.choerodon.iam.api.dto;


import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 */
public class LdapConnectionDTO {
    @ApiModelProperty(value = "基础连接是否成功")
    private Boolean canConnectServer;
    @ApiModelProperty(value = "LDAP登录是否成功")
    private Boolean canLogin;
    @ApiModelProperty(value = "用户属性校验是否成功")
    private Boolean matchAttribute;
    @ApiModelProperty(value = "登录名属性是否成功")
    private String loginNameField;
    @ApiModelProperty(value = "用户名属性是否成功")
    private String realNameField;
    @ApiModelProperty(value = "手机号属性是否成功")
    private String phoneField;
    @ApiModelProperty(value = "邮箱属性是否成功")
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
