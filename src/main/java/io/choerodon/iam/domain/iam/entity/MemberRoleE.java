package io.choerodon.iam.domain.iam.entity;

/**
 * @author superlee
 * @data 2018/3/29
 */
public class MemberRoleE {

    private Long id;

    private Long roleId;

    private Long memberId;

    private String memberType;

    private Long sourceId;

    private String sourceType;

    public MemberRoleE(Long id, Long roleId, Long memberId, String memberType,
                       Long sourceId, String sourceType) {
        this.id = id;
        this.roleId = roleId;
        this.memberId = memberId;
        this.memberType = memberType;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
    }

    public Long getId() {
        return id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public String getMemberType() {
        return memberType;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public String getSourceType() {
        return sourceType;
    }


    public void insertInit(Long memberId, Long sourceId, String sourceType) {
        this.memberId = memberId;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
    }
}
