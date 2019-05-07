//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//import io.choerodon.mybatis.domain.AuditDomain;
//
//import javax.persistence.Column;
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
///**
// * @author wuguokai
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "oauth_password_history")
//public class PasswordHistoryDO extends AuditDomain {
//    @Id
//    @GeneratedValue
//    private Long id;
//    private Long userId;
//    @Column(name = "hash_password")
//    private String password;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}
