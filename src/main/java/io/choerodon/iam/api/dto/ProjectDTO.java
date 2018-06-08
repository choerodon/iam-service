package io.choerodon.iam.api.dto;

import io.choerodon.core.exception.CommonException;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.util.StringUtils;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * @author flyleft
 * @date 2018/3/22
 */
public class ProjectDTO {

    private static final String CODE_REGULAR_EXPRESSION =
            "[a-zA-Z0-9_\\.][a-zA-Z0-9_\\-\\.]*[a-zA-Z0-9_\\-]|[a-zA-Z0-9_]";

    private Long id;

    @NotEmpty(message = "error.project.name.empty")
    @Size(min = 1, max = 32, message = "error.project.code.size")
    private String name;

    private Long organizationId;

    @NotEmpty(message = "error.project.code.empty")
    @Size(min = 1, max = 14, message = "error.project.code.size")
    @Pattern(regexp = CODE_REGULAR_EXPRESSION, message = "error.project.code.illegal")
    private String code;

    private Boolean enabled;

    private Long objectVersionNumber;

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

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    public void updateCheck() {
        if (StringUtils.isEmpty(this.name)) {
            throw new CommonException("error.project.name.empty");
        }
        if (this.name.length() < 1 || this.name.length() > 32) {
            throw new CommonException("error.project.code.size");
        }
        if (this.objectVersionNumber == null) {
            throw new CommonException("error.objectVersionNumber.null");
        }
    }
}
