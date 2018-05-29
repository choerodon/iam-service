package io.choerodon.iam.infra.dataobject;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author wuguokai
 */
@ModifyAudit
@VersionAudit
@Table(name = "iam_menu_config")
public class MenuConfigDO extends AuditDomain {
    @Id
    @GeneratedValue
    private Long id;
    private Long menuId;
    private String domain;
    private String devopsServiceGroup;
    private String devopsServiceType;
    private String devopsServiceCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDevopsServiceType() {
        return devopsServiceType;
    }

    public void setDevopsServiceType(String devopsServiceType) {
        this.devopsServiceType = devopsServiceType;
    }

    public String getDevopsServiceCode() {
        return devopsServiceCode;
    }

    public void setDevopsServiceCode(String devopsServiceCode) {
        this.devopsServiceCode = devopsServiceCode;
    }

    public String getDevopsServiceGroup() {
        return devopsServiceGroup;
    }

    public void setDevopsServiceGroup(String devopsServiceGroup) {
        this.devopsServiceGroup = devopsServiceGroup;
    }
}
