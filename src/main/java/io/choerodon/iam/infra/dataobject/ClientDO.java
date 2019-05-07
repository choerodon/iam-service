//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//import io.choerodon.mybatis.domain.AuditDomain;
//
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//import javax.persistence.Transient;
//import java.util.List;
//
///**
// * @author wuguokai
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "oauth_client")
//public class ClientDO extends AuditDomain {
//    @Id
//    @GeneratedValue
//    private Long id;
//    private String name;
//    private Long organizationId;
//    private String resourceIds;
//    private String secret;
//    private String scope;
//    private String authorizedGrantTypes;
//    private String webServerRedirectUri;
//    private Long accessTokenValidity;
//    private Long refreshTokenValidity;
//    private String additionalInformation;
//    private String autoApprove;
//
//    @Transient
//    private List<RoleDO> roles;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public Long getOrganizationId() {
//        return organizationId;
//    }
//
//    public void setOrganizationId(Long organizationId) {
//        this.organizationId = organizationId;
//    }
//
//    public String getResourceIds() {
//        return resourceIds;
//    }
//
//    public void setResourceIds(String resourceIds) {
//        this.resourceIds = resourceIds;
//    }
//
//    public String getSecret() {
//        return secret;
//    }
//
//    public void setSecret(String secret) {
//        this.secret = secret;
//    }
//
//    public String getScope() {
//        return scope;
//    }
//
//    public void setScope(String scope) {
//        this.scope = scope;
//    }
//
//    public String getAuthorizedGrantTypes() {
//        return authorizedGrantTypes;
//    }
//
//    public void setAuthorizedGrantTypes(String authorizedGrantTypes) {
//        this.authorizedGrantTypes = authorizedGrantTypes;
//    }
//
//    public String getWebServerRedirectUri() {
//        return webServerRedirectUri;
//    }
//
//    public void setWebServerRedirectUri(String webServerRedirectUri) {
//        this.webServerRedirectUri = webServerRedirectUri;
//    }
//
//    public Long getAccessTokenValidity() {
//        return accessTokenValidity;
//    }
//
//    public void setAccessTokenValidity(Long accessTokenValidity) {
//        this.accessTokenValidity = accessTokenValidity;
//    }
//
//    public Long getRefreshTokenValidity() {
//        return refreshTokenValidity;
//    }
//
//    public void setRefreshTokenValidity(Long refreshTokenValidity) {
//        this.refreshTokenValidity = refreshTokenValidity;
//    }
//
//    public String getAdditionalInformation() {
//        return additionalInformation;
//    }
//
//    public void setAdditionalInformation(String additionalInformation) {
//        this.additionalInformation = additionalInformation;
//    }
//
//    public String getAutoApprove() {
//        return autoApprove;
//    }
//
//    public void setAutoApprove(String autoApprove) {
//        this.autoApprove = autoApprove;
//    }
//
//    public List<RoleDO> getRoles() {
//        return roles;
//    }
//
//    public void setRoles(List<RoleDO> roles) {
//        this.roles = roles;
//    }
//}
