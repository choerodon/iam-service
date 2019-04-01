package io.choerodon.iam.api.dto;

/**
 * @author wuguokai
 */
public class MenuConfigDTO {
    private Long id;
    private Long menuId;
    private String domain;
    private String devopsServiceGroup;
    private String devopsServiceType;
    private String devopsServiceCode;
    private Long objectVersionNumber;

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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getDevopsServiceGroup() {
        return devopsServiceGroup;
    }

    public void setDevopsServiceGroup(String devopsServiceGroup) {
        this.devopsServiceGroup = devopsServiceGroup;
    }
}
