package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;

/**
 * @author superlee
 * @data 2018/3/28
 */
public class MemberRoleDTO {

    private Long id;
    @NotNull(message = "error.role.id.null")
    private Long roleId;
    @NotNull(message = "error.member.id.null")
    private Long memberId;
    private String memberType;
    @NotNull(message = "error.source.id.null")
    private Long sourceId;
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
