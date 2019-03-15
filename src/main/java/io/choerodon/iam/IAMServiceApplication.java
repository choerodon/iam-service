package io.choerodon.iam;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import io.choerodon.eureka.event.EurekaEventHandler;
import io.choerodon.resource.annoation.EnableChoerodonResourceServer;

/**
 * @author huiyuchen
 * @author wuguokai
 */
@EnableFeignClients("io.choerodon")
//@EnableEurekaClient
@SpringBootApplication
@EnableChoerodonResourceServer
@EnableAsync
public class IAMServiceApplication {

    public static void main(String[] args) {
        EurekaEventHandler.getInstance().init();
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

    @Bean
    @Qualifier("excel-executor")
    public AsyncTaskExecutor excelImportUserExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("excel-executor");
        executor.setMaxPoolSize(5);
        executor.setCorePoolSize(4);
        return executor;
    }


    @Bean
    @Qualifier("notify-executor")
    public AsyncTaskExecutor asyncSendNoticeExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix("send-notify-executor");
        executor.setCorePoolSize(1);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(99999);
        return executor;
    }
}
