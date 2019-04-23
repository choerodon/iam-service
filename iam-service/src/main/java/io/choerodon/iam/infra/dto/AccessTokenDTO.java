package io.choerodon.iam.infra.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.util.SerializationUtils;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.Date;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "oauth_access_token")
public class AccessTokenDTO extends BaseDTO {

    @Id
    private String tokenId;

    private String authenticationId;

    private String userName;

    private String clientId;

    private String refreshToken;

    @JsonIgnore
    private byte[] authentication;

    @JsonIgnore
    private byte[] token;

    @Transient
    private OAuth2AccessToken value;

    @Transient
    private OAuth2Authentication auth2Authentication;

    @Transient
    private Date lastTime;

    @Transient
    private String redirectUri;

    @Transient
    private Long accessTokenValidity;

    @Transient
    private String accesstoken;

    @Transient
    @ApiModelProperty(value = "创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @Transient
    @ApiModelProperty(value = "失效时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date expirationTime;

    @Transient
    @ApiModelProperty(value = "是否过期")
    private Boolean isExpire;

    @Transient
    @ApiModelProperty(value = "是否为当前Token")
    private Boolean isCurrentToken;

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }

    public String getAuthenticationId() {
        return authenticationId;
    }

    public void setAuthenticationId(String authenticationId) {
        this.authenticationId = authenticationId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public OAuth2AccessToken getValue() {
        return value;
    }

    public void setValue(OAuth2AccessToken value) {
        this.value = value;
        this.token = SerializationUtils.serialize(value);
    }

    public Date getLastTime() {
        return lastTime;
    }

    public void setLastTime(Date lastTime) {
        this.lastTime = lastTime;
    }

    public byte[] getAuthentication() {
        return authentication;
    }

    public void setAuthentication(byte[] authentication) {
        this.authentication = authentication;
    }

    public byte[] getToken() {
        return token;
    }

    public void setToken(byte[] token) {
        this.token = token;
        this.value = SerializationUtils.deserialize(token);
    }

    public OAuth2Authentication getAuth2Authentication() {
        return auth2Authentication;
    }

    public void setAuth2Authentication(OAuth2Authentication oauth2Authentication) {
        this.auth2Authentication = oauth2Authentication;
        this.authentication = SerializationUtils.serialize(oauth2Authentication);
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public Long getAccessTokenValidity() {
        return accessTokenValidity;
    }

    public void setAccessTokenValidity(Long accessTokenValidity) {
        this.accessTokenValidity = accessTokenValidity;
    }

    public String getAccesstoken() {
        return accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.accesstoken = accesstoken;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Date expirationTime) {
        this.expirationTime = expirationTime;
    }

    public Boolean getExpire() {
        return isExpire;
    }

    public void setExpire(Boolean expire) {
        isExpire = expire;
    }

    public Boolean getCurrentToken() {
        return isCurrentToken;
    }

    public void setCurrentToken(Boolean currentToken) {
        isCurrentToken = currentToken;
    }
}
