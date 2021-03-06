package io.choerodon.iam.infra.exception;

import io.choerodon.core.exception.CommonException;

/**
 * 空参数异常
 *
 * @author superlee
 * @since 2019-07-10
 */
public class EmptyParamException extends CommonException {
    public EmptyParamException(String code, Object... parameters) {
        super(code, parameters);
    }

    public EmptyParamException(String code, Throwable cause, Object... parameters) {
        super(code, cause, parameters);
    }

    public EmptyParamException(String code, Throwable cause) {
        super(code, cause);
    }

    public EmptyParamException(Throwable cause, Object... parameters) {
        super(cause, parameters);
    }
}
