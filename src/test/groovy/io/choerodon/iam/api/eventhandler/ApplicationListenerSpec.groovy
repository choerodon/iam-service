package io.choerodon.iam.api.eventhandler

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dataobject.ApplicationDO
import io.choerodon.iam.infra.mapper.ApplicationMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ApplicationListenerSpec extends Specification {

    private ObjectMapper objectMapper = new ObjectMapper()

    @Autowired
    private ApplicationMapper applicationMapper

    def "Rollback"() {
        given:
        ApplicationDO example = new ApplicationDO()
        example.setOrganizationId(1L)
        example.setCode("code")
        example.setProjectId(1L)
        String message = objectMapper.writeValueAsString(example)
        ApplicationListener listener = new ApplicationListener(applicationMapper)

        when:
        listener.rollback(message)

        then:
        noExceptionThrown()
    }
}
