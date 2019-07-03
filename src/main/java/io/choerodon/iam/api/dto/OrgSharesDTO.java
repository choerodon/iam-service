package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

/**
 * 此DTO 用于 market-service feign 调用
 *
 * @author Eugen
 * @since 2019/07/02
 */
public class OrgSharesDTO {
    @ApiModelProperty("组织主键")
    private Long id;
    @ApiModelProperty(value = "组织名")
    private String name;
    @ApiModelProperty(value = "组织编码")
    private String code;
    @ApiModelProperty(value = "是否停用")
    private Boolean enabled;
    @ApiModelProperty(value = "组织类别Code")
    private String categoryCode;
    @ApiModelProperty(value = "组织类别Name")
    private String categoryName;


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

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
