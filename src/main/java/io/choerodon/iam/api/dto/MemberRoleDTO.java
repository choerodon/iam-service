package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 * @data 2018/3/28
 */
public class MemberRoleDTO {

    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;
    @ApiModelProperty(value = "角色ID/必填")
    @NotNull(message = "error.role.id.null")
    private Long roleId;
    @ApiModelProperty(value = "成员ID/必填")
    @NotNull(message = "error.member.id.null")
    private Long memberId;
    @ApiModelProperty(value = "成员类型/非必填/默认：user")
    private String memberType;
    @ApiModelProperty(value = "资源ID/必填")
    @NotNull(message = "error.source.id.null")
    private Long sourceId;
    @ApiModelProperty(value = "来源类型（project/organization）/非必填")
    private String sourceType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getMemberType() {
        return memberType;
    }

    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
}
