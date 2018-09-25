package io.choerodon.iam.api.dto;

import java.util.Map;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

public class WsSendDTO {

    @NotNull(message = "error.postPm.idNull")
    private Long id;

    @NotEmpty(message = "error.postPm.codeEmpty")
    private String code;

    @NotEmpty(message = "error.postPm.templateCodeEmpty")
    private String templateCode;

    private Map<String, Object> params;

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

    public String getTemplateCode() {
        return templateCode;
    }

    public void setTemplateCode(String templateCode) {
        this.templateCode = templateCode;
    }

    public Map<String, Object> getParams() {
        return params;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }
}
