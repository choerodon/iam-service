package io.choerodon.iam;

import io.choerodon.resource.annoation.EnableChoerodonResourceServer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * @author huiyuchen
 * @author wuguokai
 */
@EnableFeignClients("io.choerodon")
@EnableEurekaClient
@SpringBootApplication
//todo 22
//@EnableChoerodonResourceServer
@EnableAsync
public class IAMServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(IAMServiceApplication.class, args);
    }

    @Bean
    @Qualifier("ldap-executor")
    public AsyncTaskExecutor asyncTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("ldap-executor");
        executor.setMaxPoolSize(3);
        executor.setCorePoolSize(2);
        return executor;
    }
}
