package io.choerodon.iam.infra.config;

import org.hibernate.validator.HibernateValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 * @author Zheng Mofang
 * @since 2018-08-21
 */
@Configuration
public class HibernateValidatorConfiguration {

    /**
     * This configuration is for null but fail_fast therefore the default configuration is
     * not adopted.
     * @return bean of type {@link Validator} with fail_fast feature
     */
    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                .addProperty("hibernate.validator.fail_fast", "true")
                .buildValidatorFactory();
        return validatorFactory.getValidator();
    }
}
