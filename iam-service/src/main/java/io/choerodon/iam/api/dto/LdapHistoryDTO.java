package io.choerodon.iam.api.dto;

import java.util.Date;

import io.swagger.annotations.ApiModelProperty;

/**
 * @author superlee
 */
public class LdapHistoryDTO {
    @ApiModelProperty(value = "主键")
    private Long id;
    @ApiModelProperty(value = "LDAP 主键")
    private Long ldapId;
    @ApiModelProperty(value = "上次同步新增用户个数")
    private Long newUserCount;
    @ApiModelProperty(value = "同步成功用户个数")
    private Long updateUserCount;
    @ApiModelProperty(value = "同步失败用户个数")
    private Long errorUserCount;
    @ApiModelProperty(value = "上次同步开始时间")
    private Date syncBeginTime;
    @ApiModelProperty(value = "上次同步结束时间")
    private Date syncEndTime;
    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLdapId() {
        return ldapId;
    }

    public void setLdapId(Long ldapId) {
        this.ldapId = ldapId;
    }

    public Long getNewUserCount() {
        return newUserCount;
    }

    public void setNewUserCount(Long newUserCount) {
        this.newUserCount = newUserCount;
    }

    public Long getUpdateUserCount() {
        return updateUserCount;
    }

    public void setUpdateUserCount(Long updateUserCount) {
        this.updateUserCount = updateUserCount;
    }

    public Long getErrorUserCount() {
        return errorUserCount;
    }

    public void setErrorUserCount(Long errorUserCount) {
        this.errorUserCount = errorUserCount;
    }

    public Date getSyncBeginTime() {
        return syncBeginTime;
    }

    public void setSyncBeginTime(Date syncBeginTime) {
        this.syncBeginTime = syncBeginTime;
    }

    public Date getSyncEndTime() {
        return syncEndTime;
    }

    public void setSyncEndTime(Date syncEndTime) {
        this.syncEndTime = syncEndTime;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
