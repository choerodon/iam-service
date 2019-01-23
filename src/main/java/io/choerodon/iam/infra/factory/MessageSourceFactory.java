package io.choerodon.iam.infra.factory;

import org.springframework.context.MessageSource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

/**
 * 根据basename生成对应messageSource工厂类
 *
 * @author superlee
 */
public class MessageSourceFactory {

    private MessageSourceFactory() {
    }

    public static MessageSource create(String basename) {
        ReloadableResourceBundleMessageSource messageBundle =
                new ReloadableResourceBundleMessageSource();
        messageBundle.setBasename(basename);
        messageBundle.setDefaultEncoding("UTF-8");
        return messageBundle;
    }
}
