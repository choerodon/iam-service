package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author superlee
 */
@VersionAudit
@ModifyAudit
@Table(name = "oauth_ldap_error_user")
public class LdapErrorUserDO extends AuditDomain {

    @Id
    @GeneratedValue
    private Long id;
    private Long ldapHistoryId;
    private String uuid;
    private String loginName;
    private String email;
    private String realName;
    private String phone;
    private String cause;

    public Long getId() {
        return id;
    }

    public LdapErrorUserDO setId(Long id) {
        this.id = id;
        return this;
    }

    public Long getLdapHistoryId() {
        return ldapHistoryId;
    }

    public LdapErrorUserDO setLdapHistoryId(Long ldapHistoryId) {
        this.ldapHistoryId = ldapHistoryId;
        return this;
    }

    public String getUuid() {
        return uuid;
    }

    public LdapErrorUserDO setUuid(String uuid) {
        this.uuid = uuid;
        return this;
    }

    public String getLoginName() {
        return loginName;
    }

    public LdapErrorUserDO setLoginName(String loginName) {
        this.loginName = loginName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public LdapErrorUserDO setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getRealName() {
        return realName;
    }

    public LdapErrorUserDO setRealName(String realName) {
        this.realName = realName;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public LdapErrorUserDO setPhone(String phone) {
        this.phone = phone;
        return this;
    }

    public String getCause() {
        return cause;
    }

    public LdapErrorUserDO setCause(String cause) {
        this.cause = cause;
        return this;
    }
}
