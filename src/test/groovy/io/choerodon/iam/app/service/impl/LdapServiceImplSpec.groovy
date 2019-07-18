package io.choerodon.iam.app.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.infra.asserts.LdapAssertHelper
import io.choerodon.iam.infra.asserts.OrganizationAssertHelper
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask
import io.choerodon.iam.infra.dto.LdapDTO
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper
import io.choerodon.iam.infra.mapper.LdapHistoryMapper
import io.choerodon.iam.infra.mapper.LdapMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*    */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LdapServiceImplSpec extends Specification {
    @Autowired
    OrganizationAssertHelper organizationAssertHelper
    LdapAssertHelper ldapAssertHelper = Mock(LdapAssertHelper)
    @Autowired
    LdapMapper ldapMapper
    @Autowired
    LdapSyncUserTask ldapSyncUserTask
    @Autowired
    LdapSyncUserTask.FinishFallback finishFallback
    @Autowired
    LdapErrorUserMapper ldapErrorUserMapper
    @Autowired
    LdapHistoryMapper ldapHistoryMapper
    LdapService ldapService


    def setup() {
        ldapService = new LdapServiceImpl(organizationAssertHelper, ldapAssertHelper,
                ldapMapper, ldapSyncUserTask, finishFallback, ldapErrorUserMapper, ldapHistoryMapper)
        LdapDTO ldapDTO = new LdapDTO()
        ldapDTO.setServerAddress("ldap://acfun.hand.com")
        ldapDTO.setPort("389")
        ldapDTO.setUseSSL(false)
        ldapDTO.setDirectoryType("OpenLDAP")
        ldapDTO.setObjectClass("person")
        ldapDTO.setRealNameField("displayName")
        ldapDTO.setLoginNameField("employeeNumber")
        ldapDTO.setEmailField("mail")
        ldapDTO.setPhoneField("mobile")
        ldapDTO.setBaseDn("ou=emp,dc=hand,dc=com")
        ldapDTO.setConnectionTimeout(1000)

        ldapAssertHelper.ldapNotExisted(_, _) >> ldapDTO
    }

    def "SyncLdapUser"() {
//        given: "构造请求参数"
//        Long organizationId = 1L
//        Long id = 1L
//
//        when: "调用方法"
//        ldapService.syncLdapUser(organizationId, id)
//
//        then: "校验结果"
//        true
    }
}
