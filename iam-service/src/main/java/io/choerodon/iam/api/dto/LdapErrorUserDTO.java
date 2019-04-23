//package io.choerodon.iam.api.dto;
//
//import io.swagger.annotations.ApiModelProperty;
//
///**
// * @author superlee
// */
//public class LdapErrorUserDTO {
//
//    @ApiModelProperty(value = "主键")
//    private Long id;
//    @ApiModelProperty(value = "外键，ldap history id")
//    private Long ldapHistoryId;
//    @ApiModelProperty(value = "ldap server 端对象的唯一标识，可以根据该字段在ldap server中查询该对象")
//    private String uuid;
//    @ApiModelProperty(value = "登录名")
//    private String loginName;
//    @ApiModelProperty(value = "邮箱")
//    private String email;
//    @ApiModelProperty(value = "真实姓名")
//    private String realName;
//    @ApiModelProperty(value = "手机号")
//    private String phone;
//    @ApiModelProperty(value = "同步失败原因")
//    private String cause;
//    public Long getId() {
//        return id;
//    }
//
//    public LdapErrorUserDTO setId(Long id) {
//        this.id = id;
//        return this;
//    }
//
//    public Long getLdapHistoryId() {
//        return ldapHistoryId;
//    }
//
//    public LdapErrorUserDTO setLdapHistoryId(Long ldapHistoryId) {
//        this.ldapHistoryId = ldapHistoryId;
//        return this;
//    }
//
//    public String getUuid() {
//        return uuid;
//    }
//
//    public LdapErrorUserDTO setUuid(String uuid) {
//        this.uuid = uuid;
//        return this;
//    }
//
//    public String getLoginName() {
//        return loginName;
//    }
//
//    public LdapErrorUserDTO setLoginName(String loginName) {
//        this.loginName = loginName;
//        return this;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public LdapErrorUserDTO setEmail(String email) {
//        this.email = email;
//        return this;
//    }
//
//    public String getRealName() {
//        return realName;
//    }
//
//    public LdapErrorUserDTO setRealName(String realName) {
//        this.realName = realName;
//        return this;
//    }
//
//    public String getPhone() {
//        return phone;
//    }
//
//    public LdapErrorUserDTO setPhone(String phone) {
//        this.phone = phone;
//        return this;
//    }
//
//    public String getCause() {
//        return cause;
//    }
//
//    public LdapErrorUserDTO setCause(String cause) {
//        this.cause = cause;
//        return this;
//    }
//}
