package io.choerodon.iam.api.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiParam;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.util.StringUtils;

import io.choerodon.core.exception.CommonException;

/**
 * @author flyleft
 */
public class ProjectDTO {

    private static final String CODE_REGULAR_EXPRESSION =
            "^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$";

    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @ApiModelProperty(value = "项目名/必填")
    @NotEmpty(message = "error.project.name.empty")
    @Size(min = 1, max = 32, message = "error.project.code.size")
    private String name;

    @ApiParam(name = "organization_id", value = "组织id")
    @ApiModelProperty(value = "组织ID/非必填")
    private Long organizationId;

    @ApiModelProperty(value = "项目编码/必填")
    @NotEmpty(message = "error.project.code.empty")
    @Size(min = 1, max = 14, message = "error.project.code.size")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.project.code.illegal")
    private String code;

    @ApiModelProperty(value = "是否启用/非必填")
    private Boolean enabled;

    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;

    @ApiModelProperty(value = "项目类型code/非必填")
    private String type;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void updateCheck() {
        if (StringUtils.isEmpty(this.name)) {
            throw new CommonException("error.project.name.empty");
        }
        if (this.name.length() < 1 || this.name.length() > 32) {
            throw new CommonException("error.project.code.size");
        }
        if (this.objectVersionNumber == null) {
            throw new CommonException("error.objectVersionNumber.null");
        }
    }
}
