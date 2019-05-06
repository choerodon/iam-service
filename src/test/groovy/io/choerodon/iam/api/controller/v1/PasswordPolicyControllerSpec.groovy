package io.choerodon.iam.api.controller.v1

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.exception.CommonException
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.validator.PasswordPolicyValidator
import io.choerodon.iam.infra.dto.PasswordPolicyDTO
import io.choerodon.iam.infra.mapper.PasswordPolicyMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import spock.lang.Specification
import spock.lang.Stepwise

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class PasswordPolicyControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations/{organization_id}/password_policies"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private PasswordPolicyMapper policyMapper

    def "QueryByOrganizationId"() {
        given: "构造请求参数"
        def organizationId = 1L

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH, PasswordPolicyDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(organizationId)
    }

    def "Update"() {
        given: "构造请求参数"
        def organizationId = 1L
        def passwordPolicyId = 1L
        def passwordPolicyDTO = ConvertHelper.convert(policyMapper.selectByPrimaryKey(passwordPolicyId), PasswordPolicyDTO)
        passwordPolicyDTO.setDigitsCount(1)
        passwordPolicyDTO.setLowercaseCount(1)
        passwordPolicyDTO.setUppercaseCount(1)
        passwordPolicyDTO.setSpecialCharCount(1)
        passwordPolicyDTO.setMinLength(1)
        passwordPolicyDTO.setMaxLength(10)

        when: "调用方法[异常-密码策略不存在]"
        def passwordPolicyDTO1 = new PasswordPolicyDTO()
        BeanUtils.copyProperties(passwordPolicyDTO, passwordPolicyDTO1)
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}", passwordPolicyDTO1, ExceptionResponse, organizationId, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.passwordPolicy.not.exist")

        when: "调用方法[异常-组织id不存在]"
        def passwordPolicyDTO2 = new PasswordPolicyDTO()
        BeanUtils.copyProperties(passwordPolicyDTO, passwordPolicyDTO2)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", passwordPolicyDTO2, ExceptionResponse, 1000L, passwordPolicyId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.passwordPolicy.organizationId.not.same")

        when: "调用方法[异常-密码超过最大长度]"
        def passwordPolicyDTO3 = new PasswordPolicyDTO()
        BeanUtils.copyProperties(passwordPolicyDTO, passwordPolicyDTO3)
        passwordPolicyDTO3.setMaxLength(3)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", passwordPolicyDTO3, ExceptionResponse, organizationId, passwordPolicyId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.allLeastRequiredLength.greaterThan.maxLength")

        when: "调用方法[异常-密码最小长度大于最大长度]"
        def passwordPolicyDTO4 = new PasswordPolicyDTO()
        BeanUtils.copyProperties(passwordPolicyDTO, passwordPolicyDTO4)
        passwordPolicyDTO4.setMinLength(20)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", passwordPolicyDTO4, ExceptionResponse, organizationId, passwordPolicyId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.maxLength.lessThan.minLength")

        when: "调用方法"
        def passwordPolicyDTO5 = new PasswordPolicyDTO()
        BeanUtils.copyProperties(passwordPolicyDTO, passwordPolicyDTO5)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", passwordPolicyDTO5, PasswordPolicyDTO, organizationId, passwordPolicyId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(passwordPolicyId)
    }

    def "Create"() {
        given: "构造请求参数"
        Long orgId = 1L
        PasswordPolicyDTO passwordPolicyDTO = new PasswordPolicyDTO()
        List<PasswordPolicyDTO> policyDOList = new ArrayList<>()
        policyDOList << new PasswordPolicyDTO()
        PasswordPolicyMapper passwordPolicyMapper = Mock(PasswordPolicyMapper)
        PasswordPolicyValidator passwordPolicyValidator =
                new PasswordPolicyValidator()
        Field field = passwordPolicyValidator.getClass().getDeclaredField("passwordPolicyMapper")
        field.setAccessible(true)
        field.set(passwordPolicyValidator, passwordPolicyMapper)

        when: "测试PasswordPolicyValidator create"
        passwordPolicyValidator.create(orgId, passwordPolicyDTO)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.passwordPolicy.organizationId.exist")
        1 * passwordPolicyMapper.select(_) >> { policyDOList }

        when: "测试PasswordPolicyValidator create"
        passwordPolicyValidator.create(orgId, passwordPolicyDTO)

        then: "校验结果"
        exception = thrown(CommonException)
        exception.message.equals("error.passwordPolicy.code.exist")
        passwordPolicyMapper.select(_) >>> [new ArrayList<PasswordPolicyDTO>(), policyDOList]
    }
}

