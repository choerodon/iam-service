package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.dto.StartInstanceDTO
import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.ProjectTypeService
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.app.service.RoleMemberService
import io.choerodon.iam.app.service.UserService
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper
import io.choerodon.iam.infra.asserts.ProjectAssertHelper
import io.choerodon.iam.infra.asserts.UserAssertHelper
import io.choerodon.iam.infra.dto.ProjectDTO
import io.choerodon.iam.infra.feign.AsgardFeignClient
import io.choerodon.iam.infra.mapper.LabelMapper
import io.choerodon.iam.infra.mapper.ProjectCategoryMapper
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import io.choerodon.iam.infra.mapper.ProjectRelationshipMapper
import io.choerodon.iam.infra.mapper.ProjectTypeMapper
import io.choerodon.iam.infra.mapper.RoleMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*  */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class OrganizationProjectServiceImplSpec extends Specification {
    private SagaClient sagaClient = Mock(SagaClient)
    private AsgardFeignClient asgardFeignClient = Mock(AsgardFeignClient)
    @Autowired
    private UserService userService
    @Autowired
    private ProjectTypeService projectTypeService
    @Autowired
    private OrganizationProjectService organizationProjectService
    @Autowired
    private ProjectMapCategoryMapper projectMapCategoryMapper
    @Autowired
    private ProjectCategoryMapper projectCategoryMapper
    @Autowired
    private ProjectMapper projectMapper
    @Autowired
    ProjectAssertHelper projectAssertHelper
    @Autowired
    ProjectTypeMapper projectTypeMapper
    @Autowired
    OrganizationAssertHelper organizationAssertHelper
    @Autowired
    UserAssertHelper userAssertHelper
    @Autowired
    RoleMapper roleMapper
    @Autowired
    LabelMapper labelMapper

    @Autowired
    ProjectRelationshipMapper projectRelationshipMapper
    @Autowired
    RoleMemberService roleMemberService

    def setup() {
        given: "构造organizationProjectService"
        organizationProjectService = new OrganizationProjectServiceImpl(sagaClient, userService, asgardFeignClient, projectMapCategoryMapper,
                projectCategoryMapper, projectMapper, projectAssertHelper, projectTypeMapper, organizationAssertHelper, userAssertHelper,
                roleMapper, labelMapper, projectRelationshipMapper, roleMemberService)
        Field field = organizationProjectService.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationProjectService, true)

        Field field1 = organizationProjectService.getClass().getDeclaredField("categoryEnable")
        field1.setAccessible(true)
        field1.set(organizationProjectService, false)
        DetailsHelper.setCustomUserDetails(1, "zh_CN")
    }

    @Transactional
    def "CreateProject"() {
        given: "构造请求参数"
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("name")
        projectDTO.setCode("code")
        projectDTO.setEnabled(true)
        projectDTO.setOrganizationId(1L)

        when: "调用方法"
        organizationProjectService.createProject(projectDTO)

        then: "校验结果"
        noExceptionThrown()
    }

    def "QueryAll"() {
        when: "调用方法"
        def result = organizationProjectService.queryAll(new ProjectDTO())

        then: "校验结果"
        result.isEmpty()

    }

    @Transactional
    def "Update"() {
        given: "mock"
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("name")
        projectDTO.setCode("code")
        projectDTO.setEnabled(true)
        projectDTO.setOrganizationId(1L)
        long id = organizationProjectService.create(projectDTO).getId()
        ProjectDTO dto = projectMapper.selectByPrimaryKey(id)
        dto.setName("name1")
        CustomUserDetails customUserDetails = new CustomUserDetails("admin","admin")
        customUserDetails.setUserId(1L)
        customUserDetails.setLanguage("zh_CN")
        customUserDetails.setTimeZone("zkk")
        DetailsHelper.setCustomUserDetails(customUserDetails)

        when: "调用方法"
        def entity = organizationProjectService.update(1L, dto)

        then: "校验结果"
        entity.objectVersionNumber ==2

    }

    @Transactional
    def "EnableProject"() {
        given:""
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("name")
        projectDTO.setCode("code")
        projectDTO.setEnabled(true)
        projectDTO.setOrganizationId(1L)
        long id =organizationProjectService.create(projectDTO).getId()

        when: "调用方法"
        organizationProjectService.enableProject(1L, id, 1L)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }


    @Transactional
    def "DisableProject"() {
        given:""
        ProjectDTO projectDTO = new ProjectDTO()
        projectDTO.setName("name")
        projectDTO.setCode("code")
        projectDTO.setEnabled(true)
        projectDTO.setOrganizationId(1L)
        long id = organizationProjectService.create(projectDTO).getId()

        when: "调用方法"
        organizationProjectService.enableProject(1L, id, 1L)

        then: "校验结果"
        1 * sagaClient.startSaga(_ as String, _ as StartInstanceDTO)
    }
}
