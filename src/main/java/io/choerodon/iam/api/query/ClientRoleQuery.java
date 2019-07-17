package io.choerodon.iam.api.query;

import io.swagger.annotations.ApiModelProperty;

/**
 * 组织下查看客户端和角色对应关系的搜索条件
 *
 * @author zmf
 */
public class ClientRoleQuery {

    @ApiModelProperty(value = "角色名")
    private String roleName;

    @ApiModelProperty(value = "客户端名")
    private String clientName;

    @ApiModelProperty(value = "参数")
    private String[] param;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String[] getParam() {
        return param;
    }

    public void setParam(String[] param) {
        this.param = param;
    }
}
