package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 */
public class LdapAccountDTO {
    @ApiModelProperty(value = "LDAP测试账号/必填")
    @NotEmpty(message = "error.ldap.account.empty")
    private String account;
    @ApiModelProperty(value = "LDAP测试账号密码/必填")
    @NotEmpty(message = "error.ldap.password.empty")
    private String password;

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
}
