//package io.choerodon.iam.domain.iam.entity;
//
///**
// * @author wuguokai
// */
//public class MenuE {
//
//    public static final String ROOT = "root";
//    public static final String DIR = "dir";
//    public static final String MENU = "menu";
//
//    private Long id;
//    private String code;
//    private String name;
//    private String level;
//    private Long parentId;
//    //1、root 根目录 2、dir 目录 3、menu 菜单
//    private String type;
//    private Integer sort;
//    private Boolean isDefault;
//    private String icon;
//    private String route;
//    private String category;
//    private Long objectVersionNumber;
//
//    public MenuE(String code, String name, String level, Long parentId, String type, Integer sort,
//                 Boolean isDefault, String icon, String route, String category, Long objectVersionNumber) {
//        this.code = code;
//        this.name = name;
//        this.level = level;
//        this.parentId = parentId;
//        this.type = type;
//        this.sort = sort;
//        this.isDefault = isDefault;
//        this.icon = icon;
//        this.objectVersionNumber = objectVersionNumber;
//        this.route = route;
//        this.category = category;
//    }
//
//    public Integer getSort() {
//        return sort;
//    }
//
//    public void setSort(Integer sort) {
//        this.sort = sort;
//    }
//
//    //修改名字
//    public void editName(String name) {
//        this.name = name;
//    }
//
//    //更新图标
//    public void updateIcon(String icon) {
//        this.icon = icon;
//    }
//
//    public Long getParentId() {
//        return parentId;
//    }
//
//    public void setParentId(Long parentId) {
//        this.parentId = parentId;
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
//    public String getName() {
//        return name;
//    }
//
//    public String getLevel() {
//        return level;
//    }
//
//    public String getType() {
//        return type;
//    }
//
//    public Boolean getDefault() {
//        return isDefault;
//    }
//
//    public void setDefault(Boolean isDefault) {
//        this.isDefault = isDefault;
//    }
//
//    public String getIcon() {
//        return icon;
//    }
//
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public void setObjectVersionNumber(Long objectVersionNumber) {
//        this.objectVersionNumber = objectVersionNumber;
//    }
//
//    public void nonDefault() {
//        this.isDefault = false;
//    }
//
//    public String getRoute() {
//        return route;
//    }
//
//    public String getCategory() {
//        return category;
//    }
//
//    public void setCategory(String category) {
//        this.category = category;
//    }
//}
