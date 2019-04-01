package io.choerodon.iam.api.dto;

/**
 * @author Eugen
 */
public class ClientCreateDTO {
    private String name;
    private String secret;

    public ClientCreateDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public ClientCreateDTO(String name, String secret) {
        this.name = name;
        this.secret = secret;
    }
}
