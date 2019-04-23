//package io.choerodon.iam.api.dto;
//
//import java.util.List;
//import javax.persistence.Transient;
//import javax.validation.constraints.NotNull;
//import javax.validation.constraints.Pattern;
//
//import io.swagger.annotations.ApiModelProperty;
//
///**
// * @author wuguokai
// */
//public class MenuDTO {
//    private static final String CODE_REGULAR_EXPRESSION
//            = "^[a-z]([-.a-z0-9]*[a-z0-9])$";
//
//    @ApiModelProperty(value = "主键ID/非必填")
//    private Long id;
//    @ApiModelProperty(value = "菜单编码/必填")
//    @NotNull(message = "error.menuCode.null")
//    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.menu.code.illegal")
//    private String code;
//
//    @ApiModelProperty(value = "菜单名/必填")
//    @NotNull(message = "error.menuName.null")
//    private String name;
//
//    @ApiModelProperty(value = "菜单层级/必填")
//    @NotNull(message = "error.menuLevel.null")
//    private String level;
//
//    @ApiModelProperty(value = "菜单父节点ID/必填")
//    @NotNull(message = "error.parentId.null")
//    private Long parentId;
//
//    @ApiModelProperty(value = "菜单类型（root/dir/menu）/必填")
//    //1、root 根目录 2、dir 目录 3、menu 菜单)
//    @NotNull(message = "error.menuType.null")
//    private String type;
//
//    @ApiModelProperty(value = "菜单顺序/非必填")
//    private Integer sort;
//
//    @ApiModelProperty(value = "是否为默认菜单/非必填")
//    private Boolean isDefault;
//
//    @ApiModelProperty(value = "菜单图标/非必填")
//    @NotNull(message = "error.menuIcon.null")
//    private String icon;
//
//    @ApiModelProperty(value = "菜单路由/非必填")
//    private String route;
//
//    @ApiModelProperty(value = "菜单分类/非必填")
//    private String category;
//
//    @ApiModelProperty(value = "objectVersionNumber")
//    private Long objectVersionNumber;
//
//    private List<PermissionDTO> permissions;
//
//    @Transient
//    private String zhName;
//    @Transient
//    private String enName;
//
//    @Transient
//    private List<MenuDTO> subMenus;
//
//    public Integer getSort() {
//        return sort;
//    }
//
//    public void setSort(Integer sort) {
//        this.sort = sort;
//    }
//
//    public List<PermissionDTO> getPermissions() {
//        return permissions;
//    }
//
//    public void setPermissions(List<PermissionDTO> permissions) {
//        this.permissions = permissions;
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
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getLevel() {
//        return level;
//    }
//
//    public void setLevel(String level) {
//        this.level = level;
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
//    public String getType() {
//        return type;
//    }
//
//    public void setType(String type) {
//        this.type = type;
//    }
//
//    public Boolean getDefault() {
//        return isDefault;
//    }
//
//    public void setDefault(Boolean aDefault) {
//        isDefault = aDefault;
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
//    public Long getObjectVersionNumber() {
//        return objectVersionNumber;
//    }
//
//    public void setObjectVersionNumber(Long objectVersionNumber) {
//        this.objectVersionNumber = objectVersionNumber;
//    }
//
//    public String getZhName() {
//        return zhName;
//    }
//
//    public void setZhName(String zhName) {
//        this.zhName = zhName;
//    }
//
//    public String getEnName() {
//        return enName;
//    }
//
//    public void setEnName(String enName) {
//        this.enName = enName;
//    }
//
//    public List<MenuDTO> getSubMenus() {
//        return subMenus;
//    }
//
//    public void setSubMenus(List<MenuDTO> subMenus) {
//        this.subMenus = subMenus;
//    }
//
//    public String getRoute() {
//        return route;
//    }
//
//    public void setRoute(String route) {
//        this.route = route;
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
