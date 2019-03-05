package io.choerodon.iam.infra.enums;

/**
 * @author Eugen
 **/
public enum ProjectCategory {
    AGILE("agile"),
    PROGRAM("program"),
    ANALYTICAL("analytical");
    private String value;

    public String value() {
        return value;
    }

    ProjectCategory(String value) {
        this.value = value;
    }
}
