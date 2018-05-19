package io.choerodon.iam.infra.dataobject;

import javax.persistence.Id;

/**
 * @author wuguokai
 */
public class MenuTlDO {
    @Id
    private String lang;
    @Id
    private Long id;
    private String name;

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
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
}
