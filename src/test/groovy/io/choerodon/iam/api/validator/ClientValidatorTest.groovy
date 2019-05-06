package io.choerodon.iam.api.validator

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.ClientDTO
import io.choerodon.iam.infra.mapper.ClientMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT


@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class ClientValidatorTest extends Specification {
    ClientValidator clientValidator
    ClientMapper clientMapper = Mock(ClientMapper)

    void setup() {
        clientValidator = new ClientValidator(clientMapper)
    }

    def "Create"() {
        given: "构造验证DTO"
        def clientdo = new ClientDTO()
        clientdo.setName(name)
        clientdo.setSecret(secret)
        when: "方法调用"
        clientMapper.select(_) >> { return Collections.emptyList() }
        clientValidator.create(clientdo)
        then: ""
        def e = thrown(CommonException)
        e.message == msg
        where: "dto变量"
        name                                                              | secret                                                            || msg
        "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890黑" | "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"  || "error.client.name.regex"
        "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"  | "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890黑" || "error.client.secret.regex"
    }
}
