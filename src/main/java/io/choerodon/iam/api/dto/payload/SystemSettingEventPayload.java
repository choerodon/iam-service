package io.choerodon.iam.api.dto.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 *  用于 saga 传递消息，字段含义参照 {@link io.choerodon.iam.api.dto.SystemSettingDTO}
 *
 * @author zmf
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingEventPayload implements Serializable {
    private String favicon;

    private String systemLogo;

    private String systemTitle;

    private String systemName;

    private String defaultPassword;

    private String defaultLanguage;
}
