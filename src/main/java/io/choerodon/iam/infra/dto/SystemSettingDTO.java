package io.choerodon.iam.infra.dto;

import io.choerodon.mybatis.entity.BaseDTO;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;

/**
 * @author superlee
 * @since 2019-04-23
 */
@Table(name = "IAM_SYSTEM_SETTING")
public class SystemSettingDTO extends BaseDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ApiModelProperty(value = "平台徽标，非必填字段，图片地址，大小缩放显示")
    private String favicon;

    @ApiModelProperty(value = "平台导航栏图形标，非必填字段，图片，大小缩放")
    private String systemLogo;

    @ApiModelProperty(value = "平台全称，非必填字段，如果此字段为空，则展示平台简称的信息")
    private String systemTitle;

    @ApiModelProperty(value = "平台简称，必填字段，20字符")
    @NotEmpty(message = "error.setting.name.null")
    @Length(max = 20, message = "error.setting.name.too.long")
    private String systemName;

    @ApiModelProperty(value = "平台默认密码，必填字段，至少6字符，至多15字符，数字或字母")
    @NotEmpty(message = "error.setting.default.password.null")
    @Length(min = 6, max = 15, message = "error.setting.default.password.length.invalid")
    @Pattern(regexp = "[a-zA-Z0-9]+", message = "error.setting.default.password.format.invalid")
    private String defaultPassword;

    @ApiModelProperty(value = "平台默认语言，必填字段")
    @NotEmpty(message = "error.setting.default.language.null")
    private String defaultLanguage;

    @ApiModelProperty(value = "不启用组织层密码策略时的密码最小长度，非必填字段，默认0")
    @Range(min = 0, max = 65535, message = "error.minLength")
    private Integer minPasswordLength;

    @ApiModelProperty(value = "不启用组织层密码策略时的密码最大长度, 非必填字段，默认65535")
    @Range(min = 0, max = 65535, message = "error.maxLength")
    private Integer maxPasswordLength;

    private Boolean registerEnabled;

    private String registerUrl;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFavicon() {
        return favicon;
    }

    public void setFavicon(String favicon) {
        this.favicon = favicon;
    }

    public String getSystemLogo() {
        return systemLogo;
    }

    public void setSystemLogo(String systemLogo) {
        this.systemLogo = systemLogo;
    }

    public String getSystemTitle() {
        return systemTitle;
    }

    public void setSystemTitle(String systemTitle) {
        this.systemTitle = systemTitle;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getDefaultPassword() {
        return defaultPassword;
    }

    public void setDefaultPassword(String defaultPassword) {
        this.defaultPassword = defaultPassword;
    }

    public String getDefaultLanguage() {
        return defaultLanguage;
    }

    public void setDefaultLanguage(String defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    }

    public Integer getMinPasswordLength() {
        return minPasswordLength;
    }

    public void setMinPasswordLength(Integer minPasswordLength) {
        this.minPasswordLength = minPasswordLength;
    }

    public Integer getMaxPasswordLength() {
        return maxPasswordLength;
    }

    public void setMaxPasswordLength(Integer maxPasswordLength) {
        this.maxPasswordLength = maxPasswordLength;
    }

    public Boolean getRegisterEnabled() {
        return registerEnabled;
    }

    public void setRegisterEnabled(Boolean registerEnabled) {
        this.registerEnabled = registerEnabled;
    }

    public String getRegisterUrl() {
        return registerUrl;
    }

    public void setRegisterUrl(String registerUrl) {
        this.registerUrl = registerUrl;
    }
}
