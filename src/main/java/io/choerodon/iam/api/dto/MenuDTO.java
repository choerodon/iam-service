package io.choerodon.iam.api.dto;

import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.List;

/**
 * @author wuguokai
 */
public class MenuDTO {
    private static final String CODE_REGULAR_EXPRESSION
            = "^[a-z]([-.a-z0-9]*[a-z0-9])$";

    private Long id;
    @NotNull(message = "error.menuCode.null")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.menu.code.illegal")
    private String code;
    @NotNull(message = "error.menuName.null")
    private String name;
    @NotNull(message = "error.menuLevel.null")
    private String level;
    @NotNull(message = "error.parentId.null")
    private Long parentId;
    //1、root 根目录 2、dir 目录 3、menu 菜单)
    @NotNull(message = "error.menuType.null")
    private String type;
    private Integer sort;
    private Boolean isDefault;
    @NotNull(message = "error.menuIcon.null")
    private String icon;
    private String route;
    private Long objectVersionNumber;

    private List<PermissionDTO> permissions;

    @Transient
    private String zhName;
    @Transient
    private String enName;

    @Transient
    private List<MenuDTO> subMenus;

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getZhName() {
        return zhName;
    }

    public void setZhName(String zhName) {
        this.zhName = zhName;
    }

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    public List<MenuDTO> getSubMenus() {
        return subMenus;
    }

    public void setSubMenus(List<MenuDTO> subMenus) {
        this.subMenus = subMenus;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }
}
