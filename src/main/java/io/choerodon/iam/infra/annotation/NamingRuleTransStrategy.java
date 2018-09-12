package io.choerodon.iam.infra.annotation;

/**
 * @author dengyouquan
 * UNDER_LINE：实体类为Under_line命名，前端url传值为camel命名
 * CAMEL：实体类为Camel命名，前端url传值为under_line命名
 **/
public enum  NamingRuleTransStrategy {
    CAMEL("CAMEL"),
    UNDER_LINE("UNDER_LINE");
    private String value;

    public String value() {
        return value;
    }

    NamingRuleTransStrategy(String value) {
        this.value = value;
    }
}
