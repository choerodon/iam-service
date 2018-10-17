package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.Pattern;
import java.io.Serializable;

/**
 * @author zmf
 * @since 2018-10-15
 */
public class SystemSettingDTO implements Serializable {
    @ApiModelProperty(value = "平台徽标，必填字段，图片地址，大小缩放显示")
    @NotEmpty(message = "error.setting.favicon.null")
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

    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;

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

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }
}
