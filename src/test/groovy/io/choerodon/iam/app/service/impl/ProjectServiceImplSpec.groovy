package io.choerodon.iam.app.service.impl

import com.netflix.discovery.converters.Auto
import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.app.service.ProjectService
import io.choerodon.iam.infra.asserts.ProjectAssertHelper
import io.choerodon.iam.infra.asserts.UserAssertHelper
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.dto.ProjectDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import io.choerodon.iam.infra.mapper.UserMapper
import org.junit.runner.RunWith
import org.mockito.Mock
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*      */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ProjectServiceImplSpec extends Specification {

    ProjectService projectService

    @Autowired
    OrganizationProjectService organizationProjectService
    SagaClient sagaClient = Mock(SagaClient)
    @Autowired
    UserMapper userMapper
    @Autowired
    ProjectMapper projectMapper
    @Autowired
    ProjectAssertHelper projectAssertHelper
    @Autowired
    ProjectMapCategoryMapper projectMapCategoryMapper
    @Autowired
    UserAssertHelper userAssertHelper
    @Autowired
    OrganizationMapper organizationMapper


    def setup() {
        projectService = new ProjectServiceImpl(organizationProjectService, sagaClient,
                userMapper, projectMapper, projectAssertHelper, projectMapCategoryMapper, userAssertHelper, organizationMapper)
        //反射注入属性
        Field field = projectService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(projectService, true)
        CustomUserDetails customUserDetails = new CustomUserDetails("admin","admin")
        customUserDetails.setUserId(1L);
        customUserDetails.setLanguage("zh_CN")
        DetailsHelper.setCustomUserDetails(customUserDetails)
    }

    @Transactional
    def "Update"() {
        given: "构造请求参数"
        ProjectDTO dto = new ProjectDTO()
        dto.setCode("code123")
        dto.setName("name")
        dto.setEnabled(true)
        projectMapper.insert(dto)
        ProjectDTO example = projectMapper.selectByPrimaryKey(dto)


        when: "调用方法"
        def result = projectService.update(example)

        then: "校验结果"
        result.getObjectVersionNumber() == 2
    }

    def "DisableProject"() {
        given: "构造请求参数"
        ProjectDTO dto = new ProjectDTO()
        dto.setCode("code123")
        dto.setName("name")
        dto.setEnabled(true)
        projectMapper.insert(dto)


        when: "调用方法"
        projectService.disableProject(dto.getId())

        then: "校验结果"
        noExceptionThrown()
    }

    def "ListUserIds"() {
        given: "构造请求参数"
        Long projectId = 1L

        when: "调用方法"
        projectService.listUserIds(projectId)

        then: "校验结果"
        noExceptionThrown()
    }
}

