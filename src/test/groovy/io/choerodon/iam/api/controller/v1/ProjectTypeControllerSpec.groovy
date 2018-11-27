package io.choerodon.iam.api.controller.v1

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.service.ProjectTypeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class ProjectTypeControllerSpec extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private ProjectTypeController projectTypeController

    def "test list"() {
        given:
        def projectTypeService = Mock(ProjectTypeService)
        projectTypeController.setProjectTypeService(projectTypeService)

        when:
        def entity = restTemplate.getForEntity("/v1/projects/types", String)

        then:
        entity.statusCode.is2xxSuccessful()
        1 * projectTypeService.list()
    }
}