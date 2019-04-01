package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.ProjectDTO
import io.choerodon.iam.app.service.ProjectService
import io.choerodon.iam.domain.iam.entity.ProjectE
import io.choerodon.iam.domain.iam.entity.UserE
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.repository.ProjectRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dataobject.OrganizationDO
import io.choerodon.iam.infra.dataobject.ProjectDO
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import spock.lang.Specification

import java.lang.reflect.Field

/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper, ConvertHelper])
class ProjectServiceImplSpec extends Specification {
    //不要用@Shared，mock时有问题
    private ProjectRepository projectRepository = Mock(ProjectRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private SagaClient mockSagaClient = Mock(SagaClient)
    private ProjectService projectService

    def setup() {
        projectService = new ProjectServiceImpl(projectRepository,
                userRepository, organizationRepository, mockSagaClient)
        //反射注入属性
        Field field = projectService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(projectService, true)
    }

    def "Update"() {
        given: "构造请求参数"
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("测试")
        projectDTO.setCode("test")
        ProjectDO projectDO = new ProjectDO()
        projectDO.setName("测试")
        projectDO.setCode("test")
        projectDO.setOrganizationId(1L)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())

        and: "mock静态方法-ConvertHelper"
        //ConvertHelper中用到了BeanFactory，必须mock
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(projectDTO, ProjectDO)).thenReturn(projectDO)

        when: "调用方法"
        projectService.update(projectDTO)

        then: "校验结果"
        1 * userRepository.selectByLoginName(_ as String) >> { new UserE("password") }
        //1 * projectRepository.selectByPrimaryKey(_ as Long) >> { projectDO }
        //上一句中projectDO是null，先执行then中的mock，再执行given
        //不能用Long _是null
        1 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDO() }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * projectRepository.updateSelective(_ as ProjectDO) >> { new ProjectE() }
        1 * mockSagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "DisableProject"() {
        given: "构造请求参数"
        Long projectId = 1L

        and: "mock静态方法-ConvertHelper"
        //ConvertHelper中用到了BeanFactory，必须mock
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(_, ProjectDTO)).thenReturn(new ProjectDTO())

        when: "调用方法"
        projectService.disableProject(projectId)

        then: "校验结果"
        noExceptionThrown()
        1 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDO() }
        1 * projectRepository.updateSelective(_ as ProjectDO) >> { new ProjectE() }
        1 * mockSagaClient.startSaga(_ as String, _ as StartInstanceDTO)
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

