package io.choerodon.iam.domain.oauth.entity;

/**
 * @author wuguokai
 */
public class LdapE {
    private Long id;
    private String name;
    private Long organizationId;
    private String serverAddress;
    private String encryption;
    private String status;
    private String baseDn;
    private String ldapAttributeName;
    private String domain;
    private String description;
    private Long objectVersionNumber;

    public LdapE(Long id, String name, Long organizationId, String serverAddress, String encryption, String status,
                 String baseDn, String ldapAttributeName, String domain, String description, Long objectVersionNumber) {
        this.id = id;
        this.name = name;
        this.organizationId = organizationId;
        this.serverAddress = serverAddress;
        this.encryption = encryption;
        this.status = status;
        this.baseDn = baseDn;
        this.ldapAttributeName = ldapAttributeName;
        this.domain = domain;
        this.description = description;
        this.objectVersionNumber = objectVersionNumber;
    }

    public void editServerAddress(String serverAddress) {
        this.serverAddress = serverAddress;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public String getServerAddress() {
        return serverAddress;
    }

    public String getEncryption() {
        return encryption;
    }

    public String getStatus() {
        return status;
    }

    public String getBaseDn() {
        return baseDn;
    }

    public String getLdapAttributeName() {
        return ldapAttributeName;
    }

    public String getDomain() {
        return domain;
    }

    public String getDescription() {
        return description;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }
}
