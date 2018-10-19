package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LdapConnectionDTO
import io.choerodon.iam.domain.service.ILdapService
import io.choerodon.iam.infra.dataobject.LdapDO
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
    private ILdapService iLdapService = new ILdapServiceImpl()

    def "TestConnect"() {
        given: "构造请求参数"
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

        when: "调用方法[异常-连接失败]"
        LdapConnectionDTO ldapConnectionDTO = iLdapService.testConnect(ldapDO)

        then: "校验结果"
        !ldapConnectionDTO.getCanConnectServer()
        !ldapConnectionDTO.getCanLogin()
        !ldapConnectionDTO.getMatchAttribute()

        when: "调用方法[匿名登录]"
        ldapDO.setBaseDn("ou=employee,dc=hand-china,dc=com")
        ldapConnectionDTO = iLdapService.testConnect(ldapDO)

        then: "校验结果"
        ldapConnectionDTO.getCanConnectServer()
        ldapConnectionDTO.getCanLogin()
        ldapConnectionDTO.getMatchAttribute()


        /*when: "调用方法"
        //暂时不用真实密码测试
        ldapDO.setAccount("20631")
        ldapDO.setPassword("511322qQ")
        ldapConnectionDTO = iLdapService.testConnect(ldapDO)

        then: "校验结果"
        ldapConnectionDTO.getCanConnectServer()
        ldapConnectionDTO.getCanLogin()
        ldapConnectionDTO.getMatchAttribute()*/
    }
}
