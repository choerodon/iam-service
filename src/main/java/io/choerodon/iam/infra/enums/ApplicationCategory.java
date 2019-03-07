package io.choerodon.iam.infra.enums;

/**
 * 应用被划分为哪些类别
 *
 * @author superlee
 * @since 0.15.0
 */
public enum ApplicationCategory {

    /**
     * 开发应用
     */
    APPLICATION("普通应用", "application"),

    /**
     * 测试应用
     */
    GROUP("应用组", "application-group");

    private String value;
    private String code;

    ApplicationCategory(String value, String code) {
        this.value = value;
        this.code = code;
    }

    public String value() {
        return value;
    }

    public String code() {
        return code;
    }

    public static boolean matchCode(String code) {
        for (ApplicationCategory applicationCategory : ApplicationCategory.values()) {
            if (applicationCategory.code.equals(code)) {
                return true;
            }
        }
        return false;
    }
}
