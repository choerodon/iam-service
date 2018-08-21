package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 * @data 2018/4/12
 */
public class UserPasswordDTO {

    @ApiModelProperty(value = "新密码/必填")
    @NotEmpty
    private String password;

    @ApiModelProperty(value = "原始密码/必填")
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
