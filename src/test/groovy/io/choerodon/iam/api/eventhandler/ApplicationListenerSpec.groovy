package io.choerodon.iam.api.eventhandler

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper
import io.choerodon.iam.infra.asserts.ProjectAssertHelper
import io.choerodon.iam.infra.dto.ApplicationDTO
import io.choerodon.iam.infra.mapper.ApplicationExplorationMapper
import io.choerodon.iam.infra.mapper.ApplicationMapper
import io.choerodon.liquibase.LiquibaseConfig
import org.codehaus.jackson.map.ObjectMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(LiquibaseConfig)
class ApplicationListenerSpec extends Specification {
    private ApplicationMapper applicationMapper = Mock(ApplicationMapper)
    private ApplicationExplorationMapper applicationExplorationMapper = Mock(ApplicationExplorationMapper)
    private OrganizationAssertHelper organizationAssertHelper = Mock(OrganizationAssertHelper)
    private ProjectAssertHelper projectAssertHelper = Mock(ProjectAssertHelper)
    private ApplicationListener applicationListener = new ApplicationListener(applicationMapper,
            applicationExplorationMapper, organizationAssertHelper, projectAssertHelper)
    private ObjectMapper objectMapper = new ObjectMapper()

    @Transactional
    def "updateApplicationAbnormal"() {
        given: "构造请求参数"
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setOrganizationId(803)
        applicationDTO.setProjectId(826)
        applicationDTO.setCode("test")
        applicationDTO.setName("test")
        applicationDTO.setEnabled(true)
        applicationDTO.setAbnormal(false)
        applicationDTO.setApplicationCategory("application")
        applicationDTO.setApplicationType("normal")
        applicationMapper.insertSelective(applicationDTO)
        applicationDTO = applicationMapper.selectOne(applicationDTO)
        String message = objectMapper.writeValueAsString(applicationDTO)

        when: "调用方法"
        applicationListener.applicationCreateFail(message)

        then: "校验结果"
        ApplicationDTO applicationDTO1 = new ApplicationDTO();
        applicationDTO1.setOrganizationId(803)
        applicationDTO1.setProjectId(826)
        applicationDTO1.setCode("test")
        applicationMapper.selectOne(applicationDTO1)
        if (applicationDTO1.getAbnormal()) {
            println "iam将应用设置为异常状态成功"
        } else {
            println "iam将应用设置为异常状态失败"
        }

    }
}
