package io.choerodon.iam.api.validator

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.api.dto.PasswordPolicyDTO
import io.choerodon.iam.api.dto.SystemSettingDTO
import io.choerodon.iam.domain.repository.PasswordPolicyRepository
import io.choerodon.iam.domain.repository.SystemSettingRepository
import org.mockito.Mockito
import spock.lang.Specification
/**
 *
 * @author zmf
 *
 */
class UserPasswordValidatorSpec extends Specification {
    def "Validate"() {
        given: '配置validator'
        PasswordPolicyRepository mockPasswordPolicyRepository = Mockito.mock(PasswordPolicyRepository)
        SystemSettingRepository mockSystemSettingRepository = Mockito.mock(SystemSettingRepository)
        UserPasswordValidator userPasswordValidator = new UserPasswordValidator(mockPasswordPolicyRepository, mockSystemSettingRepository)

        and: '组织启用密码策略时'
        PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO()
        passwordPolicyDTO.setEnablePassword(true)
        Mockito.when(mockPasswordPolicyRepository.queryByOrgId(Mockito.any(Long))).thenReturn(passwordPolicyDTO)

        when:
        boolean result = userPasswordValidator.validate("12", 1L, false)

        then: '校验结果'
        result

        and: '组织未启用密码策略，系统设置为空时'
        passwordPolicyDTO.setEnablePassword(false)
        Mockito.when(mockSystemSettingRepository.getSetting()).thenReturn(null)

        when:
        result = userPasswordValidator.validate("12", 1L, false)

        then: '校验结果'
        result

        and: '组织未启用密码策略，系统设置不为空时'
        SystemSettingDTO setting = new SystemSettingDTO()
        setting.setMinPasswordLength(6)
        setting.setMaxPasswordLength(16)
        Mockito.when(mockSystemSettingRepository.getSetting()).thenReturn(setting)

        when: '测试无效的密码'
        result = userPasswordValidator.validate(" 1  234 ", 1L, false)

        then: '校验结果'
        !result

        when: '调用抛出异常'
        userPasswordValidator.validate("12", 1L, true)

        then: '校验结果'
        thrown(CommonException)

        when: '测试有效的密码'
        result = userPasswordValidator.validate("123456", 1L, true)

        then: '校验结果'
        result
    }
}
