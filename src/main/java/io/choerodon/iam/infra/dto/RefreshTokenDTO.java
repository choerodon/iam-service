package io.choerodon.iam.infra.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.choerodon.mybatis.entity.BaseDTO;

import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "oauth_refresh_token")
public class RefreshTokenDTO extends BaseDTO {

    @Id
    private String tokenId;

    @JsonIgnore
    private byte[] authentication;

    @JsonIgnore
    private byte[] token;

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
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
    }
}
