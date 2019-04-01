package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.MenuType;

/**
 * @author superlee
 */
public class MenuTypeValidator {

    private MenuTypeValidator() {
    }

    public static void validate(String type) {
        boolean rightType = false;
        for (MenuType mt : MenuType.values()) {
            if (mt.value().equals(type)) {
                rightType = true;
            }
        }
        if (!rightType) {
            throw new CommonException("error.menuType.illegal");
        }
    }
}
