package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.ProjectRepository
import io.choerodon.iam.domain.service.IProjectService
import io.choerodon.iam.infra.dto.ProjectDTO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class IProjectServiceImplSpec extends Specification {
    private ProjectRepository projectRepository = Mock(ProjectRepository)
    private IProjectService iProjectService

    def setup() {
        iProjectService = new IProjectServiceImpl(projectRepository)
    }

    def "UpdateProjectEnabled"() {
        given: "构造请求参数"
        def id = 1L

        when: "调用方法"
        iProjectService.updateProjectEnabled(id)

        then: "校验结果"
        1 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDTO() }
        1 * projectRepository.updateSelective(_)
        0 * _
    }

    def "UpdateProjectDisabled"() {
        given: "构造请求参数"
        def id = 1L

        when: "调用方法"
        iProjectService.updateProjectDisabled(id)

        then: "校验结果"
        1 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDTO() }
        1 * projectRepository.updateSelective(_)
        0 * _
    }
}
