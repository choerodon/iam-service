//package io.choerodon.iam.infra.dataobject;
//
//import javax.persistence.Entity;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
///**
// * Created by Eugen on 11/19/2018.
// */
//@Entity
//@Table(name = "oauth_refresh_token")
//public class RefreshTokenDO {
//
//    @Id
//    private String tokenId;
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
//    }
//}
