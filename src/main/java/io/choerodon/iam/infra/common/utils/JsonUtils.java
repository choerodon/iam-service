package io.choerodon.iam.infra.common.utils;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author wuguokai
 */
public class JsonUtils {
    public static boolean isJSONValid(String jsonInString) {
        try {
            final ObjectMapper mapper = new ObjectMapper();
            mapper.readTree(jsonInString);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
