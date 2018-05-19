package io.choerodon.iam.api.dto;

import java.util.List;
import java.util.regex.Matcher;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotEmpty;

/**
 * @author wuguokai
 */
public class OrganizationDTO {
    private static final String CODE_REGULAR_EXPRESSION
            = "[a-zA-Z0-9_\\.][a-zA-Z0-9_\\-\\.]*[a-zA-Z0-9_\\-]|[a-zA-Z0-9_]";

    private Long id;

    @NotEmpty(message = "error.organization.name.empty")
    @Size(min = 1, max = 32, message = "error.organization.name.size")
    private String name;

    @NotEmpty(message = "error.code.empty")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.code.illegal")
    @Size(min = 1, max = 15, message = "error.organization.code.size")
    private String code;

    private Long objectVersionNumber;

    private Boolean isEnabled;

    private Boolean isInto = true;

    private List<ProjectDTO> projects;

    public Boolean getInto() {
        return isInto;
    }

    public void setInto(Boolean into) {
        isInto = into;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<ProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDTO> projects) {
        this.projects = projects;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }
}
