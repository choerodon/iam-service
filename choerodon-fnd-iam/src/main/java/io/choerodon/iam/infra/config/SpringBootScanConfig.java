//package io.choerodon.iam.infra.config;
//
//import io.choerodon.resource.config.ChoerodonResourceServerConfiguration;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Import;
//import org.springframework.context.annotation.Profile;
//import tk.mybatis.spring.annotation.MapperScan;
//
///**
// * 模块启动配置，只有在pom.profiles.profile.properties.activatedProperties=localhost时生效
// * @author superlee
// * @@since 2019-04-16
// */
//@ComponentScan("io.choerodon.iam")
//@MapperScan(basePackages = "io.choerodon.iam.**.mapper")
//@Configuration
//@Import(ChoerodonResourceServerConfiguration.class)
//@Profile({"localhost"})
//public class SpringBootScanConfig {
//}
