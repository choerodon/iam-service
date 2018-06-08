package io.choerodon.iam.api.dto;

import java.util.Date;

/**
 * @author superlee
 */
public class LdapHistoryDTO {
    private Long id;
    private Long ldapId;
    private Long newUserCount;
    private Long updateUserCount;
    private Long errorUserCount;
    private Date syncBeginTime;
    private Date syncEndTime;
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
