package io.choerodon.iam.infra.enums;

/**
 * @author superlee
 * @since 0.16.0
 */
public enum LdapSyncType {

    /**
     * 同步用户
     */
    SYNC("sync"),

    /**
     * 禁用用户
     */
    DISABLE("disable");

    private String value;

    LdapSyncType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
