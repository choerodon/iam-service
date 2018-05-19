package io.choerodon.iam.api.dto;

/**
 * @author superlee
 * @data 2018/4/17
 */
public class RoleSearchDTO {

    private String name;
    private String code;
    private String level;
    private Boolean isEnabled;
    private Boolean isBuiltIn;
    private String[] params;

    public Boolean getBuiltIn() {
        return isBuiltIn;
    }

    public void setBuiltIn(Boolean builtIn) {
        isBuiltIn = builtIn;
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }
}
