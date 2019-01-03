package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Created by Eugen on 01/03/2019.
 */
public class AuditDTO {
    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @ApiModelProperty(value = "用户Id/必填")
    private Long userId;

    @NotEmpty(message = "error.audit.type.empty")
    @ApiModelProperty(value = "操作类型，create，update，delete，unknown/必填")
    private String type;

    @ApiModelProperty(value = "业务类型。登录、登出、更新环境等。/非必填")
    private String businessType;

    @ApiModelProperty(value = "数据类型。服务名+数据，eg.: iam-service.user/非必填")
    private String dataType;

    @ApiModelProperty(value = "操作数据/非必填")
    private String message;

    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
