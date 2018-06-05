package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 */
public class LdapAccountDTO {

    @NotEmpty(message = "error.ldap.account.empty")
    private String account;
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
