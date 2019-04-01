package io.choerodon.iam

import org.springframework.boot.test.context.TestConfiguration
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

/**
 * Created by superlee on 2018/9/7.
 */
@TestConfiguration
@Order(1)
class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    /**
     * 解决访问h2-console跨域问题
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().ignoringAntMatchers("/h2-console/**")
                .and()
                .headers().frameOptions().disable()
    }
}

