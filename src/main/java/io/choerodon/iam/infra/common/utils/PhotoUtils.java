package io.choerodon.iam.infra.common.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

public class PhotoUtils {

    private PhotoUtils() {
    }

    public static ByteArrayInputStream parse(OutputStream out) {
        ByteArrayOutputStream baos = (ByteArrayOutputStream) out;
        return new ByteArrayInputStream(baos.toByteArray());
    }
}
