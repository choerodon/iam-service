//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//import io.choerodon.mybatis.domain.AuditDomain;
//
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
///**
// * @author superlee
// */
//@VersionAudit
//@ModifyAudit
//@Table(name = "iam_role_label")
//public class RoleLabelDO extends AuditDomain {
//
//    @Id
//    @GeneratedValue
//    private Long id;
//
//    private Long roleId;
//
//    private Long labelId;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getRoleId() {
//        return roleId;
//    }
//
//    public void setRoleId(Long roleId) {
//        this.roleId = roleId;
//    }
//
//    public Long getLabelId() {
//        return labelId;
//    }
//
//    public void setLabelId(Long labelId) {
//        this.labelId = labelId;
//    }
//}
