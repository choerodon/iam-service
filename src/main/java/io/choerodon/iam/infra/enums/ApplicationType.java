package io.choerodon.iam.infra.enums;

/**
 * 应用的分类
 *
 * @author superlee
 * @since 0.15.0
 */
public enum ApplicationType {

    /**
     * 开发应用
     */
    DEVELOPMENT("开发应用", "development-application"),

    /**
     * 测试应用
     */
    TEST("测试应用", "test-application");

    private String value;
    private String code;

    ApplicationType(String value, String code) {
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
        for (ApplicationType applicationType : ApplicationType.values()) {
            if (applicationType.code.equals(code)) {
                return true;
            }
        }
        return false;
    }
}
