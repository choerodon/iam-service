package io.choerodon.iam.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Size;
import java.util.List;

/**
 * @author superlee
 */
@ApiModel(value="lookup",description="快码对象")
public class LookupDTO {

    @ApiModelProperty(value="快码id", hidden=true)
    private Long id;

    @NotEmpty(message = "error.code.empty")
    @Size(max = 32, min = 1, message = "error.code.length")
    private String code;

    private String description;

    private List<LookupValueDTO> lookupValues;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public List<LookupValueDTO> getLookupValues() {
        return lookupValues;
    }

    public void setLookupValues(List<LookupValueDTO> lookupValues) {
        this.lookupValues = lookupValues;
    }
}
