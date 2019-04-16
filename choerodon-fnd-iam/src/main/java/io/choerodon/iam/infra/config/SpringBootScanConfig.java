package io.choerodon.iam.infra.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import tk.mybatis.spring.annotation.MapperScan;

/**
 * @author superlee
 * @@since 2019-04-16
 */
@ComponentScan("io.choerodon.iam")
@MapperScan(basePackages = "io.choerodon.iam.**.mapper")
@Configuration
public class SpringBootScanConfig {
}
