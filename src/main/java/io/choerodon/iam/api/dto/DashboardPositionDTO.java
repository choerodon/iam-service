package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;

public class DashboardPositionDTO {

    @ApiModelProperty(value = "卡片X坐标")
    private Integer positionX;
    @ApiModelProperty(value = "卡片Y坐标")
    private Integer positionY;
    @ApiModelProperty(value = "卡片宽度")
    private Integer width;
    @ApiModelProperty(value = "卡片高度")
    private Integer height;

    public Integer getPositionX() {
        return positionX;
    }

    public void setPositionX(Integer positionX) {
        this.positionX = positionX;
    }

    public Integer getPositionY() {
        return positionY;
    }

    public void setPositionY(Integer positionY) {
        this.positionY = positionY;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public DashboardPositionDTO() {
    }

    public DashboardPositionDTO(Integer positionX, Integer positionY, Integer width, Integer height) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
    }
}
