package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "fd_audit")
public class AuditDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @NotNull(message = "error.audit.userId.empty")
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
}
