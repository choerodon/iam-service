package io.choerodon.iam.infra.enums;

/**
 * @author superlee
 */
public enum LabelType {

    /**
     * 角色
     */
    ROLE("role");

    private String value;

    LabelType(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

}
