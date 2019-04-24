package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

/**
 * @author superlee
 * @since 2019-04-23
 */
@MultiLanguage
@Table(name = "fd_language")
public class LanguageDTO extends BaseDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @MultiLanguageField
    @ApiModelProperty(value = "描述/非必填")
    private String description;

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
}
