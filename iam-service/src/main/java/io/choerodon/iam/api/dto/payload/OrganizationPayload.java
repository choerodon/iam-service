package io.choerodon.iam.api.dto.payload;


/**
 * @author superlee
 */
public class OrganizationPayload {

    private Long id;
    private String name;
    private String code;
    private Long userId;
    private String imageUrl;
    private String address;

    public Long getId() {
        return id;
    }

    public OrganizationPayload setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public OrganizationPayload setName(String name) {
        this.name = name;
        return this;
    }

    public String getCode() {
        return code;
    }

    public OrganizationPayload setCode(String code) {
        this.code = code;
        return this;
    }

    public Long getUserId() {
        return userId;
    }

    public OrganizationPayload setUserId(Long userId) {
        this.userId = userId;
        return this;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public OrganizationPayload setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public OrganizationPayload setAddress(String address) {
        this.address = address;
        return this;
    }
}
