package io.choerodon.iam.api.controller.v1

import io.choerodon.asgard.saga.producer.TransactionalProducer
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ApplicationDTO
import io.choerodon.iam.app.service.ApplicationService
import io.choerodon.iam.app.service.impl.ApplicationServiceImpl
import io.choerodon.iam.infra.common.utils.AssertHelper
import io.choerodon.iam.infra.dataobject.ApplicationDO
import io.choerodon.iam.infra.mapper.ApplicationMapper
import io.choerodon.mybatis.pagehelper.domain.PageRequest
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT


@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class ApplicationControllerSpec extends Specification {
    @Autowired
    ApplicationMapper applicationMapper
    @Autowired
    AssertHelper assertHelper

    ModelMapper modelMapper = new ModelMapper()

    ApplicationController controller
    TransactionalProducer producer

    def "setup"() {
        producer = Mock(TransactionalProducer)
        ApplicationService service = new ApplicationServiceImpl(applicationMapper, assertHelper, producer)
        controller = new ApplicationController(service)
    }

    def "Create"() {
        given:
        ApplicationDTO dto =
                new ApplicationDTO()
                        .setCode("code")
                        .setName("name")
                        .setApplicationCategory("application")
                        .setApplicationType("test-application")
                        .setOrganizationId(1L)
                        .setEnabled(true)

        when:
        def result = controller.create(1, dto)

        then:
        result.statusCode.is2xxSuccessful()
        result.body.code == 'code'
    }

    def "Update"() {
        given:
        ApplicationDO app = assertHelper.applicationNotExisted(1)

        when:
        def result = controller.update(1, 1, modelMapper.map(app, ApplicationDTO.class))

        then:
        result.statusCode.is2xxSuccessful()
    }

    def "PagingQuery"() {
        given:
        PageRequest pageRequest = new PageRequest(0, 10)

        when:
        def result = controller.pagingQuery(1L, pageRequest, null, null, null, null)
        then:
        result.statusCode.is2xxSuccessful()
        result.body.size() > 0
    }

    def "Enabled"() {
        when:
        controller.disable(1)
        then:
        noExceptionThrown()
    }

    def "Disable"() {
        when:
        controller.enabled(1)
        then:
        noExceptionThrown()
    }

    def "Types"() {
        when:
        def result = controller.types()
        then:
        result.body.contains("test-application")

    }

    def "Check"() {
        given:
        ApplicationDTO dto = new ApplicationDTO()
        dto.setName("nnn").setOrganizationId(1L)

        when: "插入校验name"
        controller.check(1L, dto)

        then:
        noExceptionThrown()

        when: "更新校验name"
        dto.setId(1)
        controller.check(1L, dto)

        then:
        noExceptionThrown()

        when: "更新校验code"
        dto.setName(null)
        dto.setCode("ccc")
        controller.check(1L, dto)

        then:
        noExceptionThrown()

        when: "插入校验code"
        dto.setId(null)
        controller.check(1L, dto)

        then:
        noExceptionThrown()
    }
}
