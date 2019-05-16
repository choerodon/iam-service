package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.util.List;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "iam_application")
public class ApplicationDTO extends BaseDTO {

    private static final String CODE_REGULAR_EXPRESSION = "^[a-z]([-a-z0-9]*[a-z0-9])?$";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long organizationId;

    private Long projectId;

    @Length(min = 1, max = 20, message = "error.application.name.length")
    @NotEmpty(message = "error.application.name.empty")
    private String name;

    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.application.code.illegal")
    @NotEmpty(message = "error.application.code.empty")
    private String code;

    @Column(name = "is_enabled")
    private Boolean enabled;

    @NotEmpty(message = "error.application.applicationCategory.empty")
    private String applicationCategory;

    @NotEmpty(message = "error.application.applicationType.empty")
    private String applicationType;

    @Column(name = "is_abnormal")
    private Boolean abnormal;

    @Transient
    private Integer appCount;
    @Transient
    private String projectName;
    @Transient
    private String projectCode;
    @Transient
    private String imageUrl;

    @Transient
    @ApiModelProperty(value = "发送saga事件，标记从哪里调用的")
    private String from;

    @Transient
    private List<ApplicationDTO> descendants;

    @Transient
    private List<Long> descendantIds;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
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

    public Integer getAppCount() {
        return appCount;
    }

    public void setAppCount(Integer appCount) {
        this.appCount = appCount;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public List<ApplicationDTO> getDescendants() {
        return descendants;
    }

    public void setDescendants(List<ApplicationDTO> descendants) {
        this.descendants = descendants;
    }

    public List<Long> getDescendantIds() {
        return descendantIds;
    }

    public void setDescendantIds(List<Long> descendantIds) {
        this.descendantIds = descendantIds;
    }

    public Boolean getAbnormal() {
        return abnormal;
    }

    public void setAbnormal(Boolean abnormal) {
        this.abnormal = abnormal;
    }
}
