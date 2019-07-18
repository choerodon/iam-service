package io.choerodon.iam.api.controller.v1

import io.choerodon.base.domain.PageRequest
import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.ProjectTypeService
import io.choerodon.iam.infra.dto.ProjectTypeDTO
import io.choerodon.iam.infra.mapper.ProjectTypeMapper
import org.modelmapper.ModelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ProjectTypeControllerSpec extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private ProjectTypeController projectTypeController

    @Autowired
    ProjectTypeMapper projectTypeMapper

    @Autowired
    ProjectTypeService service

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


    def "pagingQuery"() {
        given:
        ProjectTypeController controller = new ProjectTypeController(service)
        PageRequest pageRequest = new PageRequest(1, 20)

        when:
        def result = controller.pagingQuery(pageRequest, null, null, null)

        then:
        result.statusCode.is2xxSuccessful()
        !result.body.list.isEmpty()
    }

    @Transactional
    def "create"() {
        given:
        ProjectTypeController controller = new ProjectTypeController(service)
        ProjectTypeDTO dto = new ProjectTypeDTO()
        dto.setCode("test-code")
        dto.setName("name")
        dto.setDescription("desc")

        when:
        def result = controller.create(dto)

        then:
        result.statusCode.is2xxSuccessful()
        result.getBody().getCode() == "test-code"
    }

    @Transactional
    def "update"() {
        given:
        ProjectTypeController controller = new ProjectTypeController(service)
        ProjectTypeDTO example = new ProjectTypeDTO()
        example.setCode("type/others")
        ProjectTypeDTO projectType = projectTypeMapper.selectOne(example)
        ModelMapper modelMapper = new ModelMapper()
        ProjectTypeDTO dto = modelMapper.map(projectType, ProjectTypeDTO.class)
        dto.setDescription("desc")

        when:
        def result = controller.update(dto.getId(), dto)

        then:
        result.statusCode.is2xxSuccessful()
        result.getBody().description == "desc"
    }

    def "check"() {
        given:
        ProjectTypeController controller = new ProjectTypeController(service)
        ProjectTypeDTO dto = new ProjectTypeDTO()
        dto.setCode("type/research-technology")

        when:
        controller.check(dto)

        then:
        thrown(CommonException)

        when:
        dto.setId(1L)
        controller.check(dto)

        then:
        noExceptionThrown()

        when:
        dto.setId(2L)
        controller.check(dto)

        then:
        thrown(CommonException)
    }

}