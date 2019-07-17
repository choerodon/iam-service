package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LdapConnectionDTO
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.impl.LdapServiceImpl
import io.choerodon.iam.infra.dto.LdapDTO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ILdapServiceImplSpec extends Specification {
    private LdapService iLdapService = new LdapServiceImpl()

    def "TestConnect"() {
        given: "构造请求参数"
        LdapDTO ldapDO = new LdapDTO()
        ldapDO.setServerAddress("ldap://ac.hand-china.com")
        ldapDO.setPort("389")
        ldapDO.setUseSSL(false)
        ldapDO.setDirectoryType("OpenLDAP")
        ldapDO.setObjectClass("person")
        ldapDO.setRealNameField("displayName")
        ldapDO.setLoginNameField("employeeNumber")
        ldapDO.setEmailField("mail")
        ldapDO.setPhoneField("mobile")
        ldapDO.setConnectionTimeout(10)

        when: "调用方法[异常-连接失败]"
        LdapConnectionDTO ldapConnectionDTO = (LdapConnectionDTO)iLdapService.testConnect(ldapDO).get(LdapServiceImpl.LDAP_CONNECTION_DTO)

        then: "校验结果"
        !ldapConnectionDTO.getCanConnectServer()
        !ldapConnectionDTO.getCanLogin()
        !ldapConnectionDTO.getMatchAttribute()

        when: "调用方法[匿名登录]"
        ldapDO.setBaseDn("ou=employee,dc=hand-china,dc=com")
        ldapConnectionDTO = (LdapConnectionDTO)iLdapService.testConnect(ldapDO).get(LdapServiceImpl.LDAP_CONNECTION_DTO)

        then: "校验结果"
        ldapConnectionDTO.getCanConnectServer()
        ldapConnectionDTO.getCanLogin()
        !ldapConnectionDTO.getMatchAttribute()


        /*when: "调用方法"
        ldapDO.setAccount("20631")
        ldapDO.setPassword("***")
        ldapConnectionDTO = iLdapService.testConnect(ldapDO)

        then: "校验结果"
        ldapConnectionDTO.getCanConnectServer()
        ldapConnectionDTO.getCanLogin()
        ldapConnectionDTO.getMatchAttribute()*/
    }
}
