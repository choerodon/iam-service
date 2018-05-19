package io.choerodon.iam.infra.dataobject;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import java.util.List;

/**
 * @author superlee
 */
@VersionAudit
@ModifyAudit
@MultiLanguage
@Table(name = "fd_lookup")
public class LookupDO extends AuditDomain {
    @Id
    @GeneratedValue()
    private Long id;

    private String code;

    @MultiLanguageField
    private String description;

    @Transient
    private List<LookupValueDO> lookupValues;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<LookupValueDO> getLookupValues() {
        return lookupValues;
    }

    public void setLookupValues(List<LookupValueDO> lookupValues) {
        this.lookupValues = lookupValues;
    }
}
