//package io.choerodon.iam.infra.dataobject;
//
//import java.util.Date;
//import javax.persistence.Entity;
//import javax.persistence.Id;
//import javax.persistence.Table;
//import javax.persistence.Transient;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import org.springframework.security.oauth2.common.OAuth2AccessToken;
//import org.springframework.security.oauth2.common.util.SerializationUtils;
//import org.springframework.security.oauth2.provider.OAuth2Authentication;
//
///**
// * Created by Eugen on 11/19/2018.
// */
//@Entity
//@Table(name = "oauth_access_token")
//public class AccessTokenDO {
//
//    @Id
//    private String tokenId;
//
//    private String authenticationId;
//
//    private String userName;
//
//    private String clientId;
//
//    private String refreshToken;
//
//    @Transient
//    private OAuth2AccessToken value;
//
//    @Transient
//    private OAuth2Authentication auth2Authentication;
//
//    @Transient
//    private Date lastTime;
//
//    @JsonIgnore
//    private byte[] authentication;
//
//    @JsonIgnore
//    private byte[] token;
//
//    public String getTokenId() {
//        return tokenId;
//    }
//
//    public void setTokenId(String tokenId) {
//        this.tokenId = tokenId;
//    }
//
//    public String getAuthenticationId() {
//        return authenticationId;
//    }
//
//    public void setAuthenticationId(String authenticationId) {
//        this.authenticationId = authenticationId;
//    }
//
//    public String getUserName() {
//        return userName;
//    }
//
//    public void setUserName(String userName) {
//        this.userName = userName;
//    }
//
//    public String getClientId() {
//        return clientId;
//    }
//
//    public void setClientId(String clientId) {
//        this.clientId = clientId;
//    }
//
//    public String getRefreshToken() {
//        return refreshToken;
//    }
//
//    public void setRefreshToken(String refreshToken) {
//        this.refreshToken = refreshToken;
//    }
//
//    public OAuth2AccessToken getValue() {
//        return value;
//    }
//
//    public void setValue(OAuth2AccessToken value) {
//        this.value = value;
//        this.token = SerializationUtils.serialize(value);
//    }
//
//    public Date getLastTime() {
//        return lastTime;
//    }
//
//    public void setLastTime(Date lastTime) {
//        this.lastTime = lastTime;
//    }
//
//    public byte[] getAuthentication() {
//        return authentication;
//    }
//
//    public void setAuthentication(byte[] authentication) {
//        this.authentication = authentication;
//    }
//
//    public byte[] getToken() {
//        return token;
//    }
//
//    public void setToken(byte[] token) {
//        this.token = token;
//        this.value = SerializationUtils.deserialize(token);
//    }
//
//    public OAuth2Authentication getAuth2Authentication() {
//        return auth2Authentication;
//    }
//
//    public void setAuth2Authentication(OAuth2Authentication oauth2Authentication) {
//        this.auth2Authentication = oauth2Authentication;
//        this.authentication = SerializationUtils.serialize(oauth2Authentication);
//    }
//}
