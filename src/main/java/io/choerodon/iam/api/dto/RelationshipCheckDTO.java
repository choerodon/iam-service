package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class RelationshipCheckDTO {
    @ApiModelProperty(value = "是否与项目其余被占用时间冲突")
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

    public RelationshipCheckDTO() {
    }

    public RelationshipCheckDTO(Boolean result, String projectCode, String projectName) {
        this.result = result;
        this.projectCode = projectCode;
        this.projectName = projectName;
    }
}
