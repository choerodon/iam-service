package io.choerodon.iam.infra.dataobject;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author superlee
 */
@VersionAudit
@ModifyAudit
@MultiLanguage
@Table(name = "fd_lookup_value")
public class LookupValueDO extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;

    private String code;

    private Long lookupId;

    @MultiLanguageField
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getLookupId() {
        return lookupId;
    }

    public void setLookupId(Long lookupId) {
        this.lookupId = lookupId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
