package io.choerodon.iam.api.dto;

/**
 * @author jiameng.cao
 * @date 2019/6/11
 */
public class ResetPasswordDTO {
    private Boolean enable_reset;
    private String resetGitlabPasswordUrl;

    public Boolean getEnable_reset() {
        return enable_reset;
    }

    public void setEnable_reset(Boolean enable_reset) {
        this.enable_reset = enable_reset;
    }

    public String getResetGitlabPasswordUrl() {
        return resetGitlabPasswordUrl;
    }

    public void setResetGitlabPasswordUrl(String resetGitlabPasswordUrl) {
        this.resetGitlabPasswordUrl = resetGitlabPasswordUrl;
    }
}
