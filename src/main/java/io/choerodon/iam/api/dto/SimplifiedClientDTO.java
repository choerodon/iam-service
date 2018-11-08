package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author Eugen
 */
public class SimplifiedClientDTO {
    @ApiModelProperty(value = "客户端ID")
    private Long id;
    @ApiModelProperty(value = "客户端名称")
    @NotNull(message = "error.clientName.null")
    private String clientName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }
}
