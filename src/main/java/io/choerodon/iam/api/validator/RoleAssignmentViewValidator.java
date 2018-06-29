package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;

/**
 * @author superlee
 */
public class RoleAssignmentViewValidator {

    public static final String USER_VIEW = "userView";
    public static final String ROLE_VIEW = "roleView";

    private RoleAssignmentViewValidator() {
    }

    public static void validate(String view) {
        if (!USER_VIEW.equalsIgnoreCase(view)
                && !ROLE_VIEW.equalsIgnoreCase(view)) {
            throw new CommonException("error.member_role.view.illegal");
        }
    }
}
