//package io.choerodon.iam.infra.dataobject;
//
//import io.choerodon.mybatis.annotation.ModifyAudit;
//import io.choerodon.mybatis.annotation.VersionAudit;
//import io.choerodon.mybatis.domain.AuditDomain;
//
//import javax.persistence.*;
//import java.util.List;
//
///**
// * @author wuguokai
// */
//@ModifyAudit
//@VersionAudit
//@Table(name = "fd_organization")
//public class OrganizationDO extends AuditDomain {
//
//    @Id
//    @GeneratedValue
//    private Long id;
//
//    private String name;
//
//    private String code;
//
//    private Long userId;
//
//    private String address;
//
//    private String imageUrl;
//
//    @Column(name = "is_enabled")
//    private Boolean enabled;
//
//    @Transient
//    private List<ProjectDO> projects;
//
//    @Transient
//    private Integer projectCount;
//
//    @Transient
//    private List<RoleDO> roles;
//
//    public OrganizationDO() {
//    }
//
//    public OrganizationDO(String name) {
//        this.name = name;
//    }
//
//    public List<ProjectDO> getProjects() {
//        return projects;
//    }
//
//    public void setProjects(List<ProjectDO> projects) {
//        this.projects = projects;
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
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
//
//    public Boolean getEnabled() {
//        return enabled;
//    }
//
//    public void setEnabled(Boolean enabled) {
//        this.enabled = enabled;
//    }
//
//    public List<RoleDO> getRoles() {
//        return roles;
//    }
//
//    public void setRoles(List<RoleDO> roles) {
//        this.roles = roles;
//    }
//
//    public Integer getProjectCount() {
//        return projectCount;
//    }
//
//    public void setProjectCount(Integer projectCount) {
//        this.projectCount = projectCount;
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
//    public String getAddress() {
//        return address;
//    }
//
//    public void setAddress(String address) {
//        this.address = address;
//    }
//
//    public String getImageUrl() {
//        return imageUrl;
//    }
//
//    public void setImageUrl(String imageUrl) {
//        this.imageUrl = imageUrl;
//    }
//}
