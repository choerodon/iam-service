package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;


/**
 * @author superlee
 */
public class LookupValueDTO {

    private Long id;

    private Long lookupId;

    @NotEmpty(message = "error.code.empty")
    private String code;

    private String description;

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
