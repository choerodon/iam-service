//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//
//import javax.persistence.GeneratedValue;
//import javax.persistence.Id;
//import javax.persistence.Table;
//
///**
// * @author wuguokai
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "iam_menu_permission")
//public class MenuPermissionDO {
//    @Id
//    @GeneratedValue
//    private Long id;
//    private Long menuId;
//    private String permissionCode;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public Long getMenuCode() {
//        return menuId;
//    }
//
//    public void setMenuCode(Long menuId) {
//        this.menuId = menuId;
//    }
//
//    public String getPermissionCode() {
//        return permissionCode;
//    }
//
//    public void setPermissionCode(String permissionCode) {
//        this.permissionCode = permissionCode;
//    }
//}
