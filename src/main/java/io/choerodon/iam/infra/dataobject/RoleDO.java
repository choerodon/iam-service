package io.choerodon.iam.infra.dataobject;

import java.util.List;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author wuguokai
 */
@ModifyAudit
@VersionAudit
@MultiLanguage
@Table(name = "iam_role")
public class RoleDO extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    @MultiLanguageField
    private String name;
    private String code;
    private String description;
    private String level;
    private Boolean isEnabled;
    private Boolean isModified;
    private Boolean isEnableForbidden;
    private Boolean isBuiltIn;
    private Boolean isAssignable;


    @Transient
    private List<PermissionDO> permissions;

    @Transient
    private List<LabelDO> labels;

    public List<LabelDO> getLabels() {
        return labels;
    }

    public void setLabels(List<LabelDO> labels) {
        this.labels = labels;
    }

    public List<PermissionDO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDO> permissions) {
        this.permissions = permissions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }

    public Boolean getModified() {
        return isModified;
    }

    public void setModified(Boolean modified) {
        isModified = modified;
    }

    public Boolean getEnableForbidden() {
        return isEnableForbidden;
    }

    public void setEnableForbidden(Boolean enableForbidden) {
        isEnableForbidden = enableForbidden;
    }

    public Boolean getBuiltIn() {
        return isBuiltIn;
    }

    public void setBuiltIn(Boolean builtIn) {
        isBuiltIn = builtIn;
    }

    public Boolean getAssignable() {
        return isAssignable;
    }

    public void setAssignable(Boolean assignable) {
        isAssignable = assignable;
    }
}
