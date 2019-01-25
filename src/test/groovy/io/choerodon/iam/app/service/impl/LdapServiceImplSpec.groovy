package io.choerodon.iam.app.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.domain.repository.LdapHistoryRepository
import io.choerodon.iam.domain.repository.LdapRepository
import io.choerodon.iam.domain.repository.OrganizationRepository
import io.choerodon.iam.domain.service.ILdapService
import io.choerodon.iam.infra.common.utils.ldap.LdapSyncUserTask
import io.choerodon.iam.infra.dataobject.LdapDO
import io.choerodon.iam.infra.dataobject.OrganizationDO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LdapServiceImplSpec extends Specification {
    private LdapRepository ldapRepository = Mock(LdapRepository)
    @Autowired
    private ILdapService iLdapService
    private OrganizationRepository organizationRepository = Mock(OrganizationRepository)
    private LdapSyncUserTask ldapSyncUserTask = Mock(LdapSyncUserTask)
    private LdapSyncUserTask.FinishFallback finishFallback = Mock(LdapSyncUserTask.FinishFallback)
    private LdapHistoryRepository ldapHistoryRepository = Mock(LdapHistoryRepository)
    private LdapService ldapService

    def setup() {
        ldapService = new LdapServiceImpl(ldapRepository, organizationRepository,
                ldapSyncUserTask, iLdapService, finishFallback, ldapHistoryRepository)
    }

    def "SyncLdapUser"() {
        given: "构造请求参数"
        Long organizationId = 1L
        Long id = 1L
        LdapDO ldapDO = new LdapDO()
        ldapDO.setServerAddress("ldap://ac.hand-china.com")
        ldapDO.setPort("389")
        ldapDO.setUseSSL(false)
        ldapDO.setDirectoryType("OpenLDAP")
        ldapDO.setObjectClass("person")
        ldapDO.setRealNameField("displayName")
        ldapDO.setLoginNameField("employeeNumber")
        ldapDO.setEmailField("mail")
        ldapDO.setPhoneField("mobile")
        ldapDO.setBaseDn("ou=employee,dc=hand-china,dc=com")

        when: "调用方法[匿名登录]"
        ldapService.syncLdapUser(organizationId, id)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(organizationId) >> { new OrganizationDO() }
        1 * ldapRepository.queryById(_) >> { ldapDO }
        1 * ldapSyncUserTask.syncLDAPUser(_, _, _,_)

        /*when: "调用方法"
        ldapDO.setAccount("20631")
        ldapDO.setPassword("****")
        ldapService.syncLdapUser(organizationId, id)

        then: "校验结果"
        1 * organizationRepository.selectByPrimaryKey(organizationId) >> { new OrganizationDO() }
        1 * ldapRepository.queryById(_) >> { ldapDO }
        1 * ldapSyncUserTask.syncLDAPUser(_, _, _)*/
    }

    def "GetLdapContext"() {
    }
}
