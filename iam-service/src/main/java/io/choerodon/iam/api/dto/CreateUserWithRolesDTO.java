package io.choerodon.iam.api.dto;

import io.choerodon.iam.infra.dataobject.UserDO;

import java.util.Set;

/**
 * @author superlee
 */
public class CreateUserWithRolesDTO {

    private UserDO user;

    private Long sourceId;

    private String sourceType;

    private String memberType;

    private Set<String> roleCode;

    public UserDO getUser() {
        return user;
    }

    public void setUser(UserDO user) {
        this.user = user;
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

    public String getMemberType() {
        return memberType;
    }

    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }

    public Set<String> getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(Set<String> roleCode) {
        this.roleCode = roleCode;
    }
}
