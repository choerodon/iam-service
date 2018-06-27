package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.iam.infra.enums.LabelType;

/**
 * @author superlee
 */
public class LabelTypeValidator {

    private LabelTypeValidator() {
    }

    public static void validate(String type) {
        boolean rightType = false;
        for (LabelType lt : LabelType.values()) {
            if (lt.value().equals(type)) {
                rightType = true;
            }
        }
        if (!rightType) {
            throw new CommonException("error.type.illegal");
        }
    }
}
