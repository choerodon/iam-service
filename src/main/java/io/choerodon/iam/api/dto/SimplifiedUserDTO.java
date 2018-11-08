package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author Eugen
 */
public class SimplifiedUserDTO {
    @ApiModelProperty(value = "userId")
    private Long id;
    @ApiModelProperty(value = "登录名")
    private String loginName;
    @ApiModelProperty(value = "用户名")
    private String realName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }
}
