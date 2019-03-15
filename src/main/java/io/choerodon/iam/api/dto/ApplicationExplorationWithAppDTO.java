package io.choerodon.iam.api.dto;

/**
 * @author superlee
 * @since 0.15.0
 */
public class ApplicationExplorationWithAppDTO extends ApplicationExplorationDTO {

    private String applicationName;
    private String applicationCode;
    private String applicationCategory;
    private String applicationType;

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getApplicationCode() {
        return applicationCode;
    }

    public void setApplicationCode(String applicationCode) {
        this.applicationCode = applicationCode;
    }

    public String getApplicationCategory() {
        return applicationCategory;
    }

    public void setApplicationCategory(String applicationCategory) {
        this.applicationCategory = applicationCategory;
    }

    public String getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(String applicationType) {
        this.applicationType = applicationType;
    }
}
