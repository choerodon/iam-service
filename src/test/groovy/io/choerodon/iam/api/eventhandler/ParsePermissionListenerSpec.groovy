package io.choerodon.iam.api.eventhandler

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.iam.entity.InstanceE
import io.choerodon.iam.domain.service.ParsePermissionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ParsePermissionListenerSpec extends Specification {
    @Autowired
    private ParsePermissionService parsePermissionService
    private ParsePermissionListener parsePermissionListener
    private final ObjectMapper mapper = new ObjectMapper()

    def setup() {
        parsePermissionListener = new ParsePermissionListener(parsePermissionService)
    }

    def "Parse"() {
        given: "构造请求参数"
        def file = new File(this.class.getResource('/templates/swagger.json').toURI())
        String swaggerJson = file.getText("UTF-8")
        InstanceE instanceE = new InstanceE()
        instanceE.setAppName("iam-service")
        instanceE.setInstanceAddress("172.31.176.1")
        instanceE.setStatus("UP")
        instanceE.setVersion("1.0")
        instanceE.setApiData(swaggerJson)
        String message = mapper.writeValueAsString(instanceE)

        when: "调用方法"
        parsePermissionListener.parse(message.getBytes("UTF-8"))

        then: "校验结果"
        noExceptionThrown()
    }
}
