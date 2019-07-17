package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.app.service.ProjectService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.dto.ProjectDTO
import io.choerodon.iam.infra.dto.UserDTO
import org.junit.runner.RunWith
import org.mockito.Mock
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import spock.lang.Specification

import java.lang.reflect.Field

/**
 * @author dengyouquan* */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class ProjectServiceImplSpec extends Specification {
    //不要用@Shared，mock时有问题
//    private ProjectRepository projectRepository = Mock(ProjectRepository)
//    private UserRepository userRepository = Mock(UserRepository)
//    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private SagaClient mockSagaClient = Mock(SagaClient)
    private OrganizationProjectService organizationProjectService = Mock(OrganizationProjectService)
    private ProjectService projectService

    def setup() {
        projectService = new ProjectServiceImpl(projectRepository,
                userRepository, organizationRepository, organizationProjectService, mockSagaClient)
        //反射注入属性
        Field field = projectService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(projectService, true)
    }

    def "Update"() {
        given: "构造请求参数"
        ProjectDTO project = new ProjectDTO()
        project.setName("测试")
        project.setCode("test")
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("测试")
        projectDTO.setCode("test")
        projectDTO.setOrganizationId(1L)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())

        and: "mock静态方法-ConvertHelper"
        UserDTO userDTO = new UserDTO()
        userDTO.setPassword("password")
        //ConvertHelper中用到了BeanFactory，必须mock
//        PowerMockito.mockStatic(ConvertHelper)
//        PowerMockito.when(ConvertHelper.convert(project, projectDTO)).thenReturn(projectDTO)

        when: "调用方法"
        projectService.update(project)

        then: "校验结果"
        1 * userRepository.selectByLoginName(_ as String) >> { userDTO }
        //1 * projectRepository.selectByPrimaryKey(_ as Long) >> { projectDO }
        //上一句中projectDO是null，先执行then中的mock，再执行given
        //不能用Long _是null
        1 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDTO() }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * projectRepository.updateSelective(_ as ProjectDTO) >> { new ProjectDTO() }
        1 * mockSagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "DisableProject"() {
        given: "构造请求参数"
        Long projectId = 1L
        and:
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())

        when: "调用方法"
        projectService.disableProject(projectId)

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
        1 * projectRepository.listUserIds(_ as Long)
    }
}

