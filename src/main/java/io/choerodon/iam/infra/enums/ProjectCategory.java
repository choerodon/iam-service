package io.choerodon.iam.infra.enums;

/**
 * @author Eugen
 **/
public enum ProjectCategory {
    AGILE("AGILE"),
    PROGRAM("PROGRAM"),
    ANALYTICAL("ANALYTICAL");
    private String value;

    public String value() {
        return value;
    }

    ProjectCategory(String value) {
        this.value = value;
    }
}
