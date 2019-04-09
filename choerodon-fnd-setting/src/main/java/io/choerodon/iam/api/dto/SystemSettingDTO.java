package io.choerodon.iam.api.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.io.Serializable;

/**
 * @author zmf
 * @since 2018-10-15
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingDTO implements Serializable {
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

    @ApiModelProperty(value = "乐观锁版本号")
    private Long objectVersionNumber;
}
