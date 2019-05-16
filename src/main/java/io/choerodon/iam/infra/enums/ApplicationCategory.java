package io.choerodon.iam.infra.enums;

/**
 * 应用被划分为哪些类别
 *
 * @author superlee
 * @since 0.15.0
 */
public enum ApplicationCategory {

    /**
     * 应用
     */
    APPLICATION("普通应用", "application"),

    /**
     * 组合应用
     */
    COMBINATION("组合应用", "combination-application");

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

    public static boolean isApplication(String code) {
        return APPLICATION.code.equals(code);
    }

    public static boolean isCombination(String code) {
        return COMBINATION.code.equals(code);
    }
}
