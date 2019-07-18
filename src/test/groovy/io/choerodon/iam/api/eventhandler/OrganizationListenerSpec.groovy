package io.choerodon.iam.api.eventhandler

import com.fasterxml.jackson.databind.ObjectMapper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.payload.OrganizationCreateEventPayload
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.OrganizationProjectService
import io.choerodon.iam.app.service.OrganizationService
import io.choerodon.iam.app.service.PasswordPolicyService
import io.choerodon.iam.app.service.UserService
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.mapper.ProjectCategoryMapper
import io.choerodon.iam.infra.mapper.ProjectMapCategoryMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification

import java.lang.reflect.Field

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*   */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class OrganizationListenerSpec extends Specification {
    @Autowired
    private LdapService ldapService
    @Autowired
    private PasswordPolicyService passwordPolicyService
    @Autowired
    private OrganizationService organizationService
    @Autowired
    UserService userService
    @Autowired
    OrganizationProjectService organizationProjectService
    @Autowired
    ProjectMapper projectMapper
    @Autowired
    ProjectCategoryMapper projectCategoryMapper
    @Autowired
    ProjectMapCategoryMapper projectMapCategoryMapper
    private OrganizationListener organizationListener
    private final ObjectMapper mapper = new ObjectMapper()

    def setup() {
        organizationListener = new OrganizationListener(ldapService, passwordPolicyService,
                organizationService, userService, organizationProjectService, projectMapper, projectCategoryMapper, projectMapCategoryMapper)

        Field field = organizationListener.getClass().getDeclaredField("devopsMessage")
        field.setAccessible(true)
        field.set(organizationListener, true)
    }

    @Transactional
    def "Create"() {
        given: "构造请求参数"
        OrganizationCreateEventPayload payload = new OrganizationCreateEventPayload()
        payload.setId(1L)
        payload.setCode("code")
        payload.setName("name")
        String message = mapper.writeValueAsString(payload)

        when: "调用方法"
        organizationListener.create(message)

        then: "校验结果"
        true
    }
}
