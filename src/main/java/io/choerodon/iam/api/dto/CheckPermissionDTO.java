package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author wuguokai
 */
public class CheckPermissionDTO {
    @ApiModelProperty(value = "权限code/必填")
    private String code;
    @ApiModelProperty(value = "来源类型（project/organization）/必填")
    private String resourceType;
    @ApiModelProperty(value = "是否通过/非必填")
    private Boolean approve;
    @ApiModelProperty(value = "组织ID/非必填")
    private Long organizationId;
    @ApiModelProperty(value = "项目ID/非必填")
    private Long projectId;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Boolean getApprove() {
        return approve;
    }

    public void setApprove(Boolean approve) {
        this.approve = approve;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}
