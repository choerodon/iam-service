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
// * @author dengyouquan
// **/
//@ModifyAudit
//@VersionAudit
//@Table(name = "IAM_BOOK_MARK")
//public class BookMarkDO extends AuditDomain {
//    @Id
//    @GeneratedValue
//    private Long id;
//    private String name;
//    private String url;
//    private String icon;
//    private String color;
//    private Long sort;
//    private Long userId;
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getUrl() {
//        return url;
//    }
//
//    public void setUrl(String url) {
//        this.url = url;
//    }
//
//    public String getIcon() {
//        return icon;
//    }
//
//    public void setIcon(String icon) {
//        this.icon = icon;
//    }
//
//    public String getColor() {
//        return color;
//    }
//
//    public void setColor(String color) {
//        this.color = color;
//    }
//
//    public Long getSort() {
//        return sort;
//    }
//
//    public void setSort(Long sort) {
//        this.sort = sort;
//    }
//
//    public Long getUserId() {
//        return userId;
//    }
//
//    public void setUserId(Long userId) {
//        this.userId = userId;
//    }
//}
