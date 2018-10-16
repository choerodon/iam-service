package io.choerodon.iam.infra.common.utils.ldap

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.OrganizationUserService
import io.choerodon.iam.domain.repository.LdapHistoryRepository
import io.choerodon.iam.domain.repository.UserRepository
import io.choerodon.iam.infra.dataobject.LdapDO
import io.choerodon.iam.infra.dataobject.LdapHistoryDO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import javax.naming.NamingEnumeration
import javax.naming.directory.Attribute
import javax.naming.directory.Attributes
import javax.naming.directory.SearchResult
import javax.naming.ldap.LdapContext

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LdapSyncUserTaskSpec extends Specification {
    private UserRepository userRepository = Mock(UserRepository)
    private OrganizationUserService organizationUserService = Mock(OrganizationUserService)
    private LdapHistoryRepository ldapHistoryRepository = Mock(LdapHistoryRepository)
    private LdapSyncUserTask ldapSyncUserTask

    def setup() {
        ldapSyncUserTask = new LdapSyncUserTask(userRepository, organizationUserService, ldapHistoryRepository)
    }

    def "SyncLDAPUser[null]"() {
        given: "构造请求参数"
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()
        NamingEnumeration enumeration = null
        LdapContext ldapContext = Mock(LdapContext)
        LdapDO ldap = new LdapDO()
        ldap.setId(1L)
        ldap.setOrganizationId(1L)
        LdapSyncUserTask.FinishFallback fallback = Mock(LdapSyncUserTask.FinishFallback)

        when: "调用方法"
        ldapSyncUserTask.syncLDAPUser(ldapContext, ldap, fallback)

        then: "校验结果"
        1 * ldapContext.search(_, _, _)
        1 * ldapHistoryRepository.insertSelective(_) >> { ldapHistoryDO }
        1 * ldapContext.close()
        1 * fallback.callback(_, _)
        0 * _
    }

    def "SyncLDAPUser"() {
        given: "构造请求参数"
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()
        NamingEnumeration enumeration = Mock(NamingEnumeration)
        SearchResult searchResult = Mock(SearchResult)
        Attributes attributes = Mock(Attributes)
        Attribute loginNameAttribute = Mock(Attribute)
        Attribute emailAttribute = Mock(Attribute)
        Attribute employeeTypeAttribute = Mock(Attribute)
        LdapContext ldapContext = Mock(LdapContext)
        LdapDO ldap = new LdapDO()
        ldap.setId(1L)
        ldap.setDirectoryType("OpenLDAP")
        ldap.setLoginNameField("login")
        ldap.setEmailField("email")
        ldap.setOrganizationId(1L)
        LdapSyncUserTask.FinishFallback fallback = LdapSyncUserTask.FinishFallbackImpl.newInstance(ldapSyncUserTask, ldapHistoryRepository)
        Set<String> matchLoginName = new HashSet<>()
        matchLoginName.add("dengyouquan")
        matchLoginName.add("dengyouquan1")
        matchLoginName.add("dengyouquan2")
        Set<String> matchEmail = new HashSet<>()
        matchEmail.add("youquan.deng@hand-china.com")
        matchEmail.add("youquan.deng1@hand-china.com")
        matchEmail.add("youquan.deng2@hand-china.com")

        when: "调用方法"
        ldapSyncUserTask.syncLDAPUser(ldapContext, ldap, fallback)

        then: "校验结果"
        1 * ldapContext.search(_, _, _) >> { enumeration }
        1 * ldapHistoryRepository.updateByPrimaryKeySelective(_)
        1 * ldapHistoryRepository.insertSelective(_) >> { ldapHistoryDO }
        1 * ldapContext.close()
        enumeration.hasMoreElements() >>> [true, false]
        1 * enumeration.nextElement() >> { searchResult }
        1 * searchResult.getAttributes() >> { attributes }
        attributes.get(_) >> {
            String str ->
                if (str.equals("employeeType")) return employeeTypeAttribute
                if (str.equals(ldap.getLoginNameField())) return loginNameAttribute
                if (str.equals(ldap.getEmailField())) return emailAttribute

                return null
        }
        loginNameAttribute.get() >> { ldap.getLoginNameField() }
        emailAttribute.get() >> { ldap.getEmailField() }
        employeeTypeAttribute.get() >> { "test" }
        1 * userRepository.matchLoginName(_) >> { matchLoginName }
        1 * userRepository.matchEmail(_) >> { matchEmail }
    }
}
