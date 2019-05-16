package io.choerodon.iam.api.dto;

import io.choerodon.iam.infra.dto.UserDTO;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 */
public class UserSearchDTO extends UserDTO {

    @ApiModelProperty(value = "其他参数")
    private String[] param;

    public String[] getParam() {
        return param;
    }

    public void setParam(String[] param) {
        this.param = param;
    }
}
