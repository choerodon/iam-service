package io.choerodon.iam.api.dto;

import org.hibernate.validator.constraints.NotEmpty;


/**
 * @author superlee
 * @data 2018-04-11
 */
public class IconDTO {

    private Long id;

    @NotEmpty(message = "error.code.empty")
    private String code;

    private Long objectVersionNumber;

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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
