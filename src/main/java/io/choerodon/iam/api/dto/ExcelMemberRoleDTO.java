package io.choerodon.iam.api.dto;

/**
 * @author superlee
 */
public class ExcelMemberRoleDTO {
    private String loginName;
    private String roleCode;
    private String cause;

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }
}
