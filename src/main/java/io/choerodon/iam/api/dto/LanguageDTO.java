package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 */
public class LanguageDTO {

    @ApiModelProperty(value = "主键")
    private Long id;
    @ApiModelProperty(value = "编码/必填")
    @Size(max = 32, min = 1, message = "error.code.length")
    @NotEmpty(message = "error.code.empty")
    private String code;
    @ApiModelProperty(value = "名称/必填")
    @Size(max = 32, min = 1, message = "error.name.length")
    @NotEmpty(message = "error.name.empty")
    private String name;
    @ApiModelProperty(value = "描述/非必填")
    private String description;
    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;

    @JsonIgnore
    private String param;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }
}
