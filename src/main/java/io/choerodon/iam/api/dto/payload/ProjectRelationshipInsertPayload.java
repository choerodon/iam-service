package io.choerodon.iam.api.dto.payload;

import java.util.Date;
import java.util.List;

/**
 * @author Eugen
 */
public class ProjectRelationshipInsertPayload {
    private Long parentId;
    private String parentCode;
    private String category;
    List<ProjectRelationship> relationships;

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentCode() {
        return parentCode;
    }

    public void setParentCode(String parentCode) {
        this.parentCode = parentCode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<ProjectRelationship> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<ProjectRelationship> relationships) {
        this.relationships = relationships;
    }

    public static class ProjectRelationship {
        private Long id;
        private String code;
        private Date startDate;
        private Date endDate;
        private Boolean enabled;

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

        public Date getStartDate() {
            return startDate;
        }

        public void setStartDate(Date startDate) {
            this.startDate = startDate;
        }

        public Date getEndDate() {
            return endDate;
        }

        public void setEndDate(Date endDate) {
            this.endDate = endDate;
        }

        public Boolean getEnabled() {
            return enabled;
        }

        public void setEnabled(Boolean enabled) {
            this.enabled = enabled;
        }

        public ProjectRelationship() {
        }

        public ProjectRelationship(Long id, String code, Date startDate, Date endDate, Boolean enabled) {
            this.id = id;
            this.code = code;
            this.startDate = startDate;
            this.endDate = endDate;
            this.enabled = enabled;
        }
    }


}
