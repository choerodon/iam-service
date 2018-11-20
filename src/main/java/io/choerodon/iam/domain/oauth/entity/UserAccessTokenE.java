package io.choerodon.iam.domain.oauth.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserAccessTokenE {
    private String tokenId;

    private String clientId;
    @JsonIgnore
    private byte[] token;

    private String redirectUri;
    //失效时间
    private Long accessTokenValidity;

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public byte[] getToken() {
        return token;
    }

    public void setToken(byte[] token) {
        this.token = token;
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
}
