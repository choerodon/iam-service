package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 */
public class ProjectTypeDTO {
    private static final String CODE_REGULAR_EXPRESSION
            = "^[a-zA-Z][a-zA-Z0-9-_.//]*$";

    private Long id;

    @ApiModelProperty(value = "项目类型编码")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.code.illegal")
    @NotEmpty(message = "error.code.empty")
    private String code;

    @ApiModelProperty(value = "项目类型名称")
    @NotEmpty(message = "error.name.empty")
    private String name;

    @ApiModelProperty(value = "项目类型描述")
    private String description;

    private Long objectVersionNumber;

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

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
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", objectVersionNumber=" + objectVersionNumber +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
