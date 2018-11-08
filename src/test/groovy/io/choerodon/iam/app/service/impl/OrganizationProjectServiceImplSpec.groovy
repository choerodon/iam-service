package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.ProjectDTO
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.domain.iam.entity.ProjectE
import io.choerodon.iam.domain.iam.entity.UserE
import io.choerodon.iam.domain.repository.LabelRepository
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.repository.ProjectRepository
import io.choerodon.iam.domain.repository.RoleRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.domain.service.IProjectService
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dataobject.OrganizationDO
import io.choerodon.iam.infra.dataobject.ProjectDO
import io.choerodon.iam.infra.dataobject.RoleDO
import org.junit.runner.RunWith
import org.mockito.Mockito
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
class OrganizationProjectServiceImplSpec extends Specification {
    private ProjectRepository projectRepository = Mock(ProjectRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private IProjectService iProjectService = Mock(IProjectService)
    private RoleRepository roleRepository = Mock(RoleRepository)
    private MemberRoleRepository memberRoleRepository = Mock(MemberRoleRepository)
    private LabelRepository labelRepository = Mock(LabelRepository)
    private SagaClient sagaClient = Mock(SagaClient)
    private IUserService iUserService = Mock(IUserService)
    private OrganizationProjectService organizationProjectService

    def setup() {
        given: "构造organizationProjectService"
        organizationProjectService = new OrganizationProjectServiceImpl(projectRepository,
                userRepository, organizationRepository, iProjectService, roleRepository,
                memberRoleRepository, labelRepository, sagaClient, iUserService)
        Field field = organizationProjectService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationProjectService, true)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())
    }

    def "CreateProject"() {
        given: "构造请求参数"
        ProjectDTO projectDTO = new ProjectDTO()

        and: "mock静态方法-ConvertHelper"
        //ConvertHelper中用到了BeanFactory，必须mock
        PowerMockito.mockStatic(ConvertHelper)
        //PowerMockito.when(ConvertHelper.convert(_, ProjectE)).thenReturn(new ProjectE())
        //注入的值是null
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new ProjectE()).thenReturn(new ProjectDTO())

        when: "调用方法"
        organizationProjectService.createProject(projectDTO)

        then: "校验结果"
        noExceptionThrown()
        1 * projectRepository.create(_) >> { new ProjectE() }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * roleRepository.selectRolesByLabelNameAndType(_, _) >> {
            List<RoleDO> list = new ArrayList<RoleDO>()
            list << new RoleDO()
            return list
        }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "QueryAll"() {
        given: "mock"
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new ProjectDO())
        PowerMockito.when(ConvertHelper.convertList(Mockito.any(), Mockito.any())).thenReturn(new ArrayList<ProjectDTO>())

        when: "调用方法"
        organizationProjectService.queryAll(new ProjectDTO())

        then: "校验结果"
        1 * projectRepository.query(_) >> { new ArrayList<ProjectDO>() }

    }

    def "Update"() {
        given: "mock"
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setObjectVersionNumber(1)
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new ProjectDO())

        when: "调用方法"
        organizationProjectService.update(1L, projectDTO)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectE() }
        1 * userRepository.selectByLoginName(_) >> { new UserE("password") }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "EnableProject"() {
        given: "mock"
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new ProjectDTO())

        when: "调用方法"
        organizationProjectService.enableProject(1L, 1L, 1L)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectE() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * projectRepository.listUserIds(_) >> {
            List<Long> userIds = new ArrayList<>()
            userIds.add(1L)
            return userIds
        }
        2 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDO() }
        1 * iUserService.sendNotice(_, _, _, _, _)
    }

    def "DisableProject"() {
        given: "mock"
        PowerMockito.mockStatic(ConvertHelper)
        PowerMockito.when(ConvertHelper.convert(Mockito.any(), Mockito.any())).thenReturn(new ProjectDTO())

        when: "调用方法"
        organizationProjectService.enableProject(1L, 1L, 1L)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectE() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * projectRepository.listUserIds(_) >> {
            List<Long> userIds = new ArrayList<>()
            userIds.add(1L)
            return userIds
        }
        2 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDO() }
        1 * iUserService.sendNotice(_, _, _, _, _)
    }
}
