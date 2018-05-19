package io.choerodon.iam.api.dto;

import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author superlee
 */
public class LanguageDTO {

    private Long id;

    @Size(max = 32, min = 1, message = "error.code.length")
    @NotEmpty(message = "error.code.empty")
    private String code;

    @Size(max = 32, min = 1, message = "error.name.length")
    @NotEmpty(message = "error.name.empty")
    private String name;

    private String description;

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
