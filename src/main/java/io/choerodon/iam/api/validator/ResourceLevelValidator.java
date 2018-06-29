package io.choerodon.iam.api.validator;

import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;

/**
 * @author superlee
 */
public class ResourceLevelValidator {

    private ResourceLevelValidator() {
    }

    public static void validate(String level) {

        boolean rightLevel = false;
        for (ResourceLevel rl : ResourceLevel.values()) {
            if (rl.value().equals(level)) {
                rightLevel = true;
            }
        }
        if (!rightLevel) {
            throw new CommonException("error.level.illegal");
        }
    }
}
