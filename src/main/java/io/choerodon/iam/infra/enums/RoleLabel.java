package io.choerodon.iam.infra.enums;

/**
 * @author superlee
 */
public enum RoleLabel {

    GITLAB_OWMER("gitlab.owner"),

    GITLAB_DEVELOPER("gitlab.developer"),

    PROJECT_OWNER("project.owner"),

    ORGANIZATION_OWNER("organization.owner");

    private final String value;

    RoleLabel(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
