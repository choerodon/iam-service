package io.choerodon.iam.api.dto.payload;

/**
 * @author suplerlee
 */
public class OrganizationRegisterPayload {

    private Long organizationId;

    private String organizationName;

    private String organizationCode;

    private Long userId;

    private String realName;

    private String loginName;

    private String email;

    private Long fromUserId;

    public Long getOrganizationId() {
        return organizationId;
    }

    public OrganizationRegisterPayload setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
        return this;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public OrganizationRegisterPayload setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
        return this;
    }

    public String getOrganizationCode() {
        return organizationCode;
    }

    public OrganizationRegisterPayload setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
        return this;
    }

    public Long getFromUserId() {
        return fromUserId;
    }

    public OrganizationRegisterPayload setFromUserId(Long fromUserId) {
        this.fromUserId = fromUserId;
        return this;
    }

    public Long getUserId() {
        return userId;
    }

    public OrganizationRegisterPayload setUserId(Long userId) {
        this.userId = userId;
        return this;
    }

    public String getRealName() {
        return realName;
    }

    public OrganizationRegisterPayload setRealName(String realName) {
        this.realName = realName;
        return this;
    }

    public String getLoginName() {
        return loginName;
    }

    public OrganizationRegisterPayload setLoginName(String loginName) {
        this.loginName = loginName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public OrganizationRegisterPayload setEmail(String email) {
        this.email = email;
        return this;
    }

}
