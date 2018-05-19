package io.choerodon.iam.infra.common.utils;

/**
 * @author superlee
 */
public class ParamsUtil {

    public static String[] parseParams(String params) {
        if (params == null) {
            return null;
        }
        return params.split(",");
    }
}
