package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.service.ProjectTypeService
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.domain.repository.*
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.dto.ProjectDTO
import io.choerodon.iam.infra.dto.RoleDTO
import io.choerodon.iam.infra.dto.UserDTO
import io.choerodon.iam.infra.feign.AsgardFeignClient
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
@PrepareForTest([DetailsHelper])
class OrganizationProjectServiceImplSpec extends Specification {
    private ProjectRepository projectRepository = Mock(ProjectRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private RoleRepository roleRepository = Mock(RoleRepository)
    private MemberRoleRepository memberRoleRepository = Mock(MemberRoleRepository)
    private LabelRepository labelRepository = Mock(LabelRepository)
    private SagaClient sagaClient = Mock(SagaClient)
    private IUserService iUserService = Mock(IUserService)
    private AsgardFeignClient asgardFeignClient = Mock(AsgardFeignClient)
    private ProjectTypeService projectTypeService = Mock(ProjectTypeService)
    private OrganizationProjectService organizationProjectService
    private ProjectRelationshipRepository projectRelationshipRepository

    def setup() {
        given: "构造organizationProjectService"
        organizationProjectService = new OrganizationProjectServiceImpl(projectRepository,
                userRepository, organizationRepository, roleRepository,
                memberRoleRepository, labelRepository, sagaClient, iUserService, asgardFeignClient,
                projectTypeService, projectRelationshipRepository)
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

        when: "调用方法"
        organizationProjectService.createProject(projectDTO)

        then: "校验结果"
        noExceptionThrown()
        1 * projectRepository.create(_) >> { new ProjectDTO() }
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * roleRepository.selectRolesByLabelNameAndType(_, _) >> {
            List<RoleDTO> list = new ArrayList<RoleDTO>()
            list << new RoleDTO()
            return list
        }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "QueryAll"() {

        when: "调用方法"
        organizationProjectService.queryAll(new ProjectDTO())

        then: "校验结果"
        1 * projectRepository.query(_) >> { new ArrayList<ProjectDTO>() }

    }

    def "Update"() {
        given: "mock"
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setObjectVersionNumber(1)
        UserDTO user = new UserDTO()
        user.setPassword("password")

        when: "调用方法"
        organizationProjectService.update(1L, projectDTO)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectDTO() }
        1 * userRepository.selectByLoginName(_) >> { user }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }

    def "EnableProject"() {

        when: "调用方法"
        organizationProjectService.enableProject(1L, 1L, 1L)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectDTO() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * projectRepository.listUserIds(_) >> {
            List<Long> userIds = new ArrayList<>()
            userIds.add(1L)
            return userIds
        }
        2 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDTO() }
        1 * iUserService.sendNotice(_, _, _, _, _)
    }

    def "DisableProject"() {

        when: "调用方法"
        organizationProjectService.enableProject(1L, 1L, 1L)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * projectRepository.updateSelective(_) >> { new ProjectDTO() }
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
        1 * projectRepository.listUserIds(_) >> {
            List<Long> userIds = new ArrayList<>()
            userIds.add(1L)
            return userIds
        }
        2 * projectRepository.selectByPrimaryKey(_) >> { new ProjectDTO() }
        1 * iUserService.sendNotice(_, _, _, _, _)
    }
}
