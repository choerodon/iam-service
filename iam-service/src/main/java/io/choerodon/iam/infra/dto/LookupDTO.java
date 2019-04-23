package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author superlee
 * @since 2019-04-23
 */
@MultiLanguage
@Table(name = "fd_lookup")
public class LookupDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "快码id", hidden = true)
    private Long id;

    @ApiModelProperty(value = "快码code")
    @NotEmpty(message = "error.code.empty")
    @Size(max = 32, min = 1, message = "error.code.length")
    private String code;

    @MultiLanguageField
    @ApiModelProperty(value = "描述")
    private String description;

    @Transient
    @ApiModelProperty(value = "快码值")
    private List<LookupValueDTO> lookupValues;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<LookupValueDTO> getLookupValues() {
        return lookupValues;
    }

    public void setLookupValues(List<LookupValueDTO> lookupValues) {
        this.lookupValues = lookupValues;
    }
}
