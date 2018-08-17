package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.LabelDTO;
import io.choerodon.iam.infra.enums.LabelType;

import java.util.Optional;

/**
 * @author superlee
 */
public class LabelValidator {

    private LabelValidator() {
    }

    public static void validate(LabelDTO label) {
        Optional.ofNullable(label.getType()).ifPresent(LabelValidator::validateType);
        Optional.ofNullable(label.getLevel()).ifPresent(LabelValidator::validateLevel);
    }

    private static void validateLevel(String level) {
        boolean rightLevel = false;
        for (ResourceLevel resourceLevel : ResourceLevel.values()) {
            if (resourceLevel.value().equals(level)) {
                rightLevel = true;
            }
        }
        if (!rightLevel) {
            throw new CommonException("error.level.illegal");
        }
    }

    private static void validateType(String type) {
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
