package io.choerodon.iam.domain.iam.entity;

import java.util.List;
import javax.persistence.*;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * @author dongfan117@gmail.com
 */
@ModifyAudit
@VersionAudit
@MultiLanguage
@Table(name = "IAM_DASHBOARD")
public class DashboardE extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    private String code;
    @MultiLanguageField
    private String name;
    private String title;
    private String namespace;
    @Column(name = "FD_LEVEL")
    private String level;
    private String description;
    private String icon;
    private Integer sort;
    private Boolean needRoles;
    @Column(name = "IS_ENABLED")
    private Boolean enabled;
    @Transient
    private List<Long> roleIds;

    public DashboardE() {
    }


    public DashboardE(
            Long id,
            String name,
            String title,
            String description,
            String icon,
            Boolean needRoles,
            Long objectVersionNumber) {
        this.setId(id);
        this.setName(name);
        this.setTitle(title);
        this.setDescription(description);
        this.setIcon(icon);
        this.setNeedRoles(needRoles);
        this.setObjectVersionNumber(objectVersionNumber);
    }

    public DashboardE(Long id, String level) {
        this.id = id;
        this.level = level;
    }

    public DashboardE(String level) {
        this.level = level;
    }

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Boolean getNeedRoles() {
        return needRoles;
    }

    public void setNeedRoles(Boolean needRoles) {
        this.needRoles = needRoles;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public List<Long> getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(List<Long> roleIds) {
        this.roleIds = roleIds;
    }
}
