package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author wuguokai
 */
@ModifyAudit
@VersionAudit
@Table(name = "oauth_login_attempt_times")
public class LoginAttemptTimesDO {
    @Id
    @GeneratedValue
    private Long id;
    private Long userId;
    private Integer loginAttemptTimes;

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

    public Integer getLoginAttemptTimes() {
        return loginAttemptTimes;
    }

    public void setLoginAttemptTimes(Integer loginAttemptTimes) {
        this.loginAttemptTimes = loginAttemptTimes;
    }
}
