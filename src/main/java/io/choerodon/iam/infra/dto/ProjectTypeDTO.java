package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "fd_project_type")
public class ProjectTypeDTO extends BaseDTO {
    private static final String CODE_REGULAR_EXPRESSION = "^[a-zA-Z][a-zA-Z0-9-_.//]*$";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ApiModelProperty(value = "项目类型编码")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.code.illegal")
    @NotEmpty(message = "error.code.empty")
    private String name;

    @ApiModelProperty(value = "项目类型名称")
    @NotEmpty(message = "error.name.empty")
    private String code;

    @ApiModelProperty(value = "项目类型描述")
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
