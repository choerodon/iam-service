package io.choerodon.iam.api.eventhandler

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.OrganizationDTO
import io.choerodon.iam.api.dto.payload.OrganizationCreateEventPayload
import io.choerodon.iam.api.dto.payload.OrganizationRegisterPayload
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.OrganizationService
import io.choerodon.iam.app.service.PasswordPolicyService
import io.choerodon.iam.app.service.RoleService
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.service.IUserService
import io.choerodon.iam.infra.mapper.ProjectMapper
import io.choerodon.iam.infra.mapper.UserMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class OrganizationListenerSpec extends Specification {
    private LdapService ldapService = Mock(LdapService)
    private PasswordPolicyService passwordPolicyService = Mock(PasswordPolicyService)
    private OrganizationService organizationService = Mock(OrganizationService)
    private IUserService iUserService = Mock(IUserService)
    private OrganizationListener organizationListener
    private final ObjectMapper mapper = new ObjectMapper()
    private RoleService roleService
    private UserMapper userMapper
    private MemberRoleRepository memberRoleRepository
    private ProjectMapper projectMapper

    def setup() {
        organizationListener = new OrganizationListener(ldapService, passwordPolicyService,
                organizationService, iUserService,projectMapper,roleService,memberRoleRepository,userMapper)

        Field field = organizationListener.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationListener, true)
    }

    def "Create"() {
        given: "构造请求参数"
        OrganizationCreateEventPayload payload = new OrganizationCreateEventPayload()
        payload.setId(1L)
        String message = mapper.writeValueAsString(payload)

        when: "调用方法"
        organizationListener.create(message)

        then: "校验结果"
        1 * organizationService.queryOrganizationById(_) >> { new OrganizationDTO() }
        1 * ldapService.create(_, _)
        1 * passwordPolicyService.create(_, _)
        0 * _
    }

    def "registerOrganization"() {
        given: "构造请求参数"
        OrganizationRegisterPayload payload = new OrganizationRegisterPayload()
        payload.setOrganizationName("aaa")
        payload.setOrganizationCode("code1314")
        payload.setUserId(1L)
        payload.setFromUserId(1L)
        payload.setEmail("110101123@qq.com")
        payload.setOrganizationId(10090L)
        payload.setLoginName("zhangsan09876")
        payload.setRealName("zhangsan")
        String message = mapper.writeValueAsString(payload)

        when: "调用方法"
        organizationListener.registerOrganization(message)

        then: "校验结果"
        noExceptionThrown()
    }
}
