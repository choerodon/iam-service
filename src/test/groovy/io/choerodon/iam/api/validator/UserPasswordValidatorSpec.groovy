package io.choerodon.iam.api.validator

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.PasswordPolicyDTO
import io.choerodon.iam.infra.dto.SystemSettingDTO
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper
import io.choerodon.iam.infra.mapper.SystemSettingMapper
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 *
 * @author zmf*
 */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class UserPasswordValidatorSpec extends Specification {
    @Autowired
    PasswordPolicyMapper passwordPolicyMapper
    @Autowired
    SystemSettingMapper settingMapper


    def "Validate"() {
        given: '配置validator'
        UserPasswordValidator userPasswordValidator = new UserPasswordValidator(passwordPolicyMapper, settingMapper)


        when:
        boolean result = userPasswordValidator.validate("12", 1L, false)

        then: '校验结果'
        result

    }
}
