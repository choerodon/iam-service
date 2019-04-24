package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "IAM_BOOK_MARK")
public class BookMarkDTO extends BaseDTO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty(value = "主键ID/非必填")
    private Long id;

    @ApiModelProperty(value = "书签名称/必填")
    @NotEmpty(message = "error.bookMark.name.empty")
    @Size(max = 64, min = 1, message = "error.bookMark.name.length")
    private String name;

    @ApiModelProperty(value = "书签url/必填")
    @NotEmpty(message = "error.bookMark.url.empty")
    @Size(max = 255, min = 1, message = "error.bookMark.url.length")
    private String url;

    @ApiModelProperty(value = "书签图标code/必填")
    @NotEmpty(message = "error.bookMark.icon.empty")
    @Size(max = 128, min = 1, message = "error.bookMark.icon.length")
    private String icon;

    @ApiModelProperty(value = "书签图标颜色/非必填")
    private String color;

    @ApiModelProperty(value = "书签顺序/必填")
    @NotNull(message = "error.bookMark.sort.null")
    private Long sort;

    @ApiModelProperty(value = "书签用户ID/非必填")
    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Long getSort() {
        return sort;
    }

    public void setSort(Long sort) {
        this.sort = sort;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
