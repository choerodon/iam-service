package io.choerodon.iam.infra.common.utils;

import io.choerodon.core.oauth.CustomUserDetails;
import io.choerodon.core.oauth.DetailsHelper;

import java.util.Locale;

public class LocaleUtils {

    private LocaleUtils() {
    }

    /**
     * 用户的language需要满足en_US,cn_ZH格式
     * 以下划线分隔，语言_国家
     *
     * @return
     */
    public static Locale locale() {
        CustomUserDetails details = DetailsHelper.getUserDetails();
        if (details == null) {
            return Locale.SIMPLIFIED_CHINESE;
        }
        String language = details.getLanguage();
        String[] arr = language.split("_");
        if (arr.length != 2) {
            return Locale.SIMPLIFIED_CHINESE;
        } else {
            String lang = arr[0];
            String country = arr[1];
            return new Locale(lang, country);
        }
    }
}
