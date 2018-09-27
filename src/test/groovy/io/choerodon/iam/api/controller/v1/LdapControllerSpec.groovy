package io.choerodon.iam.api.controller.v1

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LdapDTO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LdapControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations/{organization_id}/ldaps";

    @Autowired
    private TestRestTemplate restTemplate

    def "Create"() {
        given: "构造请求参数"
        def ldapDTO = new LdapDTO()
        ldapDTO.setName("hand")
        ldapDTO.setOrganizationId(2)
        ldapDTO.setServerAddress("ldap://ac.hand-china.com")
        ldapDTO.setObjectClass("person")
        def organizationId = 1L

    }

    def "Update"() {
    }

    def "EnableLdap"() {
    }

    def "DisableLdap"() {
    }

    def "QueryByOrgId"() {
    }

    def "Delete"() {
    }

    def "TestConnect"() {
    }

    def "SyncUsers"() {
    }

    def "LatestHistory"() {
    }
}
