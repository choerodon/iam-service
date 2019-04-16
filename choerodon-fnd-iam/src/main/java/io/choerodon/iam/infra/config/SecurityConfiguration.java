package io.choerodon.iam.infra.config;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * 本地启动模块服务，security放行所有url
 *
 * @author superlee
 * @since 2019-04-16
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final Log logger = LogFactory.getLog(SecurityConfiguration.class);
    private static final String LOCALHOST = "localhost";
    private Environment env;

    public SecurityConfiguration(Environment env) {
        super();
        this.env = env;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        if (env.acceptsProfiles(LOCALHOST)) {
            logger.debug("Using the localhost config and permit all request.");
            http
                    .authorizeRequests()
                    .antMatchers("/v1/**")
                    .permitAll()
                    .and()
                    .csrf()
                    .disable();
        } else {
            logger.debug("Using default configure(HttpSecurity). If subclassed this will potentially override subclass configure(HttpSecurity).");
            http
                    .authorizeRequests()
                    .anyRequest().authenticated()
                    .and()
                    .formLogin().and()
                    .httpBasic();
        }
    }
}
