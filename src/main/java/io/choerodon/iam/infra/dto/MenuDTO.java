package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.annotation.MultiLanguage;
import io.choerodon.mybatis.annotation.MultiLanguageField;
import io.choerodon.mybatis.entity.BaseDTO;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Objects;

/**
 * @author superlee
 * @since 2019-04-15
 */
@MultiLanguage
@Table(name = "iam_menu_b")
public class MenuDTO extends BaseDTO {

    private static final String CODE_REGULAR_EXPRESSION = "^[a-z]([-.a-z0-9]*[a-z0-9])$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "error.menu.code.empty")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.menu.code.illegal")
    private String code;
    @MultiLanguageField
    @NotEmpty(message = "error.menu.name.empty")
    private String name;
    private String pagePermissionCode;
    @NotEmpty(message = "error.menu.parentCode.null")
    private String parentCode;
    @NotEmpty(message = "error.menu.resourceLevel.empty")
    private String resourceLevel;
    @NotEmpty(message = "error.menu.type.empty")
    private String type;
    @NotEmpty
    private String serviceCode;
    private Integer sort;
    private Boolean isDefault;
    @NotEmpty(message = "error.menu.icon.empty")
    private String icon;
    private String category;
    private String modelCode;
    private Long sourceId;
    private String searchCondition;
    @Transient
    private String route;

    @Transient
    private String pagePermissionType;
    @Transient
    private List<PermissionDTO> permissions;
    @Transient
    private List<MenuDTO> subMenus;

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

    public String getPagePermissionCode() {
        return pagePermissionCode;
    }

    public void setPagePermissionCode(String pagePermissionCode) {
        this.pagePermissionCode = pagePermissionCode;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getResourceLevel() {
        return resourceLevel;
    }

    public void setResourceLevel(String resourceLevel) {
        this.resourceLevel = resourceLevel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSearchCondition() {
        return searchCondition;
    }

    public void setSearchCondition(String searchCondition) {
        this.searchCondition = searchCondition;
    }

    public List<PermissionDTO> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionDTO> permissions) {
        this.permissions = permissions;
    }

    public List<MenuDTO> getSubMenus() {
        return subMenus;
    }

    public void setSubMenus(List<MenuDTO> subMenus) {
        this.subMenus = subMenus;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getPagePermissionType() {
        return pagePermissionType;
    }

    public void setPagePermissionType(String pagePermissionType) {
        this.pagePermissionType = pagePermissionType;
    }

    public String getModelCode() {
        return modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    @Override
    public String toString() {
        return "MenuDTO{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", pagePermissionCode='" + pagePermissionCode + '\'' +
                ", parentCode='" + parentCode + '\'' +
                ", resourceLevel='" + resourceLevel + '\'' +
                ", type='" + type + '\'' +
                ", serviceCode='" + serviceCode + '\'' +
                ", sort=" + sort +
                ", isDefault=" + isDefault +
                ", icon='" + icon + '\'' +
                ", category='" + category + '\'' +
                ", modelCode='" + modelCode + '\'' +
                ", sourceId=" + sourceId +
                ", searchCondition='" + searchCondition + '\'' +
                ", route='" + route + '\'' +
                ", pagePermissionType='" + pagePermissionType + '\'' +
                ", permissions=" + permissions +
                ", subMenus=" + subMenus +
                '}';
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MenuDTO menuDTO = (MenuDTO) o;
        return Objects.equals(id, menuDTO.id) &&
                Objects.equals(code, menuDTO.code) &&
                Objects.equals(name, menuDTO.name) &&
                Objects.equals(pagePermissionCode, menuDTO.pagePermissionCode) &&
                Objects.equals(parentCode, menuDTO.parentCode) &&
                Objects.equals(resourceLevel, menuDTO.resourceLevel) &&
                Objects.equals(type, menuDTO.type) &&
                Objects.equals(serviceCode, menuDTO.serviceCode) &&
                Objects.equals(sort, menuDTO.sort) &&
                Objects.equals(isDefault, menuDTO.isDefault) &&
                Objects.equals(icon, menuDTO.icon) &&
                Objects.equals(category, menuDTO.category) &&
                Objects.equals(modelCode, menuDTO.modelCode) &&
                Objects.equals(sourceId, menuDTO.sourceId) &&
                Objects.equals(searchCondition, menuDTO.searchCondition) &&
                Objects.equals(route, menuDTO.route) &&
                Objects.equals(pagePermissionType, menuDTO.pagePermissionType) &&
                Objects.equals(permissions, menuDTO.permissions) &&
                Objects.equals(subMenus, menuDTO.subMenus);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, name, pagePermissionCode, parentCode, resourceLevel, type, serviceCode, sort, isDefault, icon, category, modelCode, sourceId, searchCondition, route, pagePermissionType, permissions, subMenus);
    }
}
