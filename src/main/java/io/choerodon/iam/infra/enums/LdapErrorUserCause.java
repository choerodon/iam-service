package io.choerodon.iam.infra.enums;

/**
 * ldap同步用户失败原因
 */
public enum LdapErrorUserCause {

    /**
     * 登录名属性字段为空
     */
    LOGIN_NAME_FIELD_NULL("login_name_field_null"),

    /**
     * 邮箱属性字段为空
     */
    EMAIL_FIELD_NULL("email_field_null"),

    /**
     * 登录名字段，attribute get()方法抛异常
     */
    LOGIN_NAME_GET_EXCEPTION("login_name_get_exception"),

    /**
     * 邮箱字段，attribute get()方法抛异常
     */
    EMAIL_GET_EXCEPTION("email_get_exception"),

    /**
     * 用户插入异常，可能是邮箱重复
     */
    USER_INSERT_ERROR("user_insert_error"),

    /**
     * 邮箱已经存在
     */
    EMAIL_ALREADY_EXISTED("email_already_existed"),

    /**
     * 禁用用户发送事件失败
     */
    SEND_MESSAGE_FAILED("send_message_failed");


    private String value;

    LdapErrorUserCause(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

}
