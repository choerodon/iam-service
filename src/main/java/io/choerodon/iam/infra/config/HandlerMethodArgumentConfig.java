package io.choerodon.iam.infra.config;

import io.choerodon.iam.infra.annotation.NamingRuleTransHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * @author dengyouquan
 **/
@Configuration
public class HandlerMethodArgumentConfig extends WebMvcConfigurerAdapter {
    @Bean
    NamingRuleTransHandler namingRuleTransHandler() {
        return new NamingRuleTransHandler();
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(namingRuleTransHandler());
    }
}
