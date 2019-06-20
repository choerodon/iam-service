package io.choerodon.iam.api.dto;

public class ProjectMapCategorySimpleDTO {
    private Long projectId;
    private String category;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
