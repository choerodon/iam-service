package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class ProjectTypeDTO {

    @ApiModelProperty(value = "项目类型编码")
    private String code;

    @ApiModelProperty(value = "项目类型名称")
    private String name;

    @ApiModelProperty(value = "项目类型描述")
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "ProjectTypeDTO{" +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
