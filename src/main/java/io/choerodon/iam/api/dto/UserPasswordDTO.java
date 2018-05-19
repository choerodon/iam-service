package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 * @data 2018/4/12
 */
public class UserPasswordDTO {

    @NotEmpty
    private String password;

    @NotEmpty
    private String originalPassword;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOriginalPassword() {
        return originalPassword;
    }

    public void setOriginalPassword(String originalPassword) {
        this.originalPassword = originalPassword;
    }
}
