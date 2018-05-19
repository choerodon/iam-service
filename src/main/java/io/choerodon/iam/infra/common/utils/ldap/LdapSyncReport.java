package io.choerodon.iam.infra.common.utils.ldap;

/**
 * @author wuguokai
 */
public class LdapSyncReport {
    private long insert;
    private long update;
    private long error;
    private long organizationId;
    private long startTime;
    private long endTime;
    private long count;

    public LdapSyncReport(long organizationId) {
        this.organizationId = organizationId;
    }


    public void incrementNewInsert() {
        this.insert++;
    }

    public void incrementError() {
        this.error++;
    }

    public void incrementUpdate() {
        this.update++;
    }

    public void incrementCount() {
        this.count++;
    }

    public long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(long organizationId) {
        this.organizationId = organizationId;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public long getInsert() {
        return insert;
    }

    public long getUpdate() {
        return update;
    }

    public long getError() {
        return error;
    }

    public long getCount() {
        return count;
    }

    @Override
    public String toString() {
        return "LdapSyncReport{"
                + "insert=" + insert
                + ", update=" + update
                + ", error=" + error
                + ", organizationId=" + organizationId
                + ", startTime=" + startTime
                + ", endTime=" + endTime
                + ", count=" + count
                + '}';
    }
}
