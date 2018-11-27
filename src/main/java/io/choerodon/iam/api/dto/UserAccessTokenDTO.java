package io.choerodon.iam.api.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;

public class UserAccessTokenDTO {

    @ApiModelProperty(value = "主键")
    private String tokenId;

    @ApiModelProperty(value = "客户端名称")
    private String clientId;

    @ApiModelProperty(value = "accessToken")
    private String accesstoken;

    @ApiModelProperty(value = "重定向Uri")
    private String redirectUri;

    @ApiModelProperty(value = "创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @ApiModelProperty(value = "失效时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date expirationTime;

    @ApiModelProperty(value = "是否过期")
    private Boolean isExpire;

    @ApiModelProperty(value = "是否为当前Token")
    private Boolean isCurrentToken;

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

    public String getAccesstoken() {
        return accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.accesstoken = accesstoken;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
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

    public UserAccessTokenDTO(String tokenId, String clientId, String redirectUri, String accesstoken, Date expirationTime, Long accessTokenValidity, String currentToken) {
        this.tokenId = tokenId;
        this.clientId = clientId;
        this.accesstoken = accesstoken;
        this.redirectUri = redirectUri;
        this.expirationTime = expirationTime;
        this.isExpire = false;
        if (expirationTime.getTime() < new Date().getTime()) {
            this.isExpire = true;
        }
        this.createTime = new Date(expirationTime.getTime() - accessTokenValidity * 1000);
        this.isCurrentToken = currentToken.equalsIgnoreCase(accesstoken);
    }

    public UserAccessTokenDTO() {
    }
}
