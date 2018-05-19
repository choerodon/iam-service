package io.choerodon.iam.api.dto;

import javax.validation.constraints.NotNull;

/**
 * @author wuguokai
 */
public class LdapDTO {
    private Long id;
    @NotNull(message = "error.ldapName.null")
    private String name;
    @NotNull(message = "error.organizationId.null")
    private Long organizationId;
    @NotNull(message = "error.serverAddress.null")
    private String serverAddress;
    private String encryption;
    private String status;
    private String baseDn;
    private String ldapAttributeName;
    private String domain;
    private String description;
    private Long objectVersionNumber;

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

    public String getServerAddress() {
        return serverAddress;
    }

    public void setServerAddress(String serverAddress) {
        this.serverAddress = serverAddress;
    }

    public String getEncryption() {
        return encryption;
    }

    public void setEncryption(String encryption) {
        this.encryption = encryption;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBaseDn() {
        return baseDn;
    }

    public void setBaseDn(String baseDn) {
        this.baseDn = baseDn;
    }

    public String getLdapAttributeName() {
        return ldapAttributeName;
    }

    public void setLdapAttributeName(String ldapAttributeName) {
        this.ldapAttributeName = ldapAttributeName;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
