package io.choerodon.iam.api.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.util.SerializationUtils;

import io.choerodon.iam.domain.oauth.entity.UserAccessTokenE;

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

    public UserAccessTokenDTO(UserAccessTokenE tokenE, String currentToken) {
        this.tokenId = tokenE.getTokenId();
        this.clientId = tokenE.getClientId();
        this.redirectUri = tokenE.getRedirectUri();
        DefaultOAuth2AccessToken token = SerializationUtils.deserialize(tokenE.getToken());
        this.accesstoken = token.getValue();
        this.expirationTime = token.getExpiration();
        this.isExpire = token.isExpired();
        this.createTime =(Date) token.getAdditionalInformation().get("createTime");
        this.isCurrentToken = currentToken.equalsIgnoreCase(this.accesstoken);
    }

    public UserAccessTokenDTO() {
    }
}
