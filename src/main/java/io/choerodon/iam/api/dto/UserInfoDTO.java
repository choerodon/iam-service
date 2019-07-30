package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class UserInfoDTO extends UserPasswordDTO {
    @ApiModelProperty(value = "用户名/非必填")
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
