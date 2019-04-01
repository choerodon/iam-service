package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotEmpty;


/**
 * @author superlee
 */
@ApiModel(value = "lookupValue", description = "快码值对象")
public class LookupValueDTO {
    @ApiModelProperty(value = "主键")
    private Long id;

    @ApiModelProperty(value = "所属快码id", hidden = true)
    private Long lookupId;

    @ApiModelProperty(value = "快码值code")
    @NotEmpty(message = "error.code.empty")
    private String code;

    @ApiModelProperty(value = "快码值描述")
    private String description;

    @ApiModelProperty(value = "objectVersionNumber", hidden = true)
    private Long objectVersionNumber;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public Long getLookupId() {
        return lookupId;
    }

    public void setLookupId(Long lookupId) {
        this.lookupId = lookupId;
    }
}
