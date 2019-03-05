package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class RelationshipEnableCheckDTO {
    @ApiModelProperty(value = "是否可启用")
    private Boolean result;

    @ApiModelProperty(value = "占用的项目code")
    private String projectCode;

    @ApiModelProperty(value = "占用的项目name")
    private String projectName;

    public Boolean getResult() {
        return result;
    }

    public void setResult(Boolean result) {
        this.result = result;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public RelationshipEnableCheckDTO() {
    }

    public RelationshipEnableCheckDTO(Boolean result, String projectCode, String projectName) {
        this.result = result;
        this.projectCode = projectCode;
        this.projectName = projectName;
    }
}
