package io.choerodon.iam.api.dto.payload;

/**
 * @author wuguokai
 */
public class OrganizationEventPayload {
    public static final String CREATE_ORGANIZATION = "createOrganization";
    private Long organizationId;

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
