package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;

import javax.persistence.*;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "oauth_password_history")
public class PasswordHistoryDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    @Column(name = "hash_password")
    private String password;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
