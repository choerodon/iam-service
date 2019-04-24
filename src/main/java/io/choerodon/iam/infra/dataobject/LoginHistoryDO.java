//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//import java.util.Date;
//
///**
// * @author wuguokai
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "oauth_login_history")
//public class LoginHistoryDO {
//    @Id
//    @GeneratedValue
//    private Long id;
//    private Long userId;
//    private Date lastLoginAt;
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
//    public Date getLastLoginAt() {
//        return lastLoginAt;
//    }
//
//    public void setLastLoginAt(Date lastLoginAt) {
//        this.lastLoginAt = lastLoginAt;
//    }
//}
