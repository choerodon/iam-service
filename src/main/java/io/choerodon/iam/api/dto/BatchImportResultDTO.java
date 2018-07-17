package io.choerodon.iam.api.dto;

import java.util.List;

/**
 * @author superlee
 */
public class BatchImportResultDTO {
    private Integer success;
    private Integer failed;
    private List<UserDTO> failedUsers;

    public Integer getSuccess() {
        return success;
    }

    public void setSuccess(Integer success) {
        this.success = success;
    }

    public Integer getFailed() {
        return failed;
    }

    public void setFailed(Integer failed) {
        this.failed = failed;
    }

    public List<UserDTO> getFailedUsers() {
        return failedUsers;
    }

    public void setFailedUsers(List<UserDTO> failedUsers) {
        this.failedUsers = failedUsers;
    }

    public void failedIncrement() {
        this.failed++;
    }

    public void successIncrement() {
        this.success++;
    }
}
