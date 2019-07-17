package io.choerodon.iam.api.controller.v1

import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LdapAccountDTO
import io.choerodon.iam.api.dto.LdapConnectionDTO
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.impl.LdapServiceImpl
import io.choerodon.iam.infra.dto.LdapDTO
import io.choerodon.iam.infra.dto.LdapErrorUserDTO
import io.choerodon.iam.infra.dto.LdapHistoryDTO
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.enums.LdapErrorUserCause
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper
import io.choerodon.iam.infra.mapper.LdapHistoryMapper
import io.choerodon.iam.infra.mapper.LdapMapper
import io.choerodon.iam.infra.mapper.OrganizationMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.transaction.annotation.Transactional
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class LdapControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations/{organization_id}/ldaps"

    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private OrganizationMapper organizationMapper
    @Autowired
    private LdapMapper ldapMapper
    @Autowired
    private LdapErrorUserMapper ldapErrorUserMapper
    @Autowired
    private LdapHistoryMapper ldapHistoryMapper

    //设置为共享，以免每个方法使用false，调用
    @Shared
    def isInit = false
    @Shared
    def needClean = false
    def ldapDTO = new LdapDTO()
    @Shared
    def organizationId = 1L
    @Shared
    OrganizationDTO organization
    @Shared
    def organizationDTO

    def setup() {
        ldapDTO.setOrganizationId(organizationId)
        ldapDTO.setServerAddress("ldap://ac.hand-china.com")
        ldapDTO.setObjectClass("person")
        ldapDTO.setSagaBatchSize(500)
        ldapDTO.setName("hand")
        ldapDTO.setOrganizationId(organizationId)
        ldapDTO.setServerAddress("ldap://ac.hand-china.com")
        ldapDTO.setObjectClass("person")
        ldapDTO.setConnectionTimeout(10)
        ldapDTO.setAccount("test")
        ldapDTO.setPassword("test")
        ldapDTO.setPort("389")
        ldapDTO.setUuidField("uid")
        if (!isInit) {
            given: "构造参数"
            organization = new OrganizationDTO()
            organization.setName("汉得")
            organization.setCode("hand")
            organization.setEnabled(true)
            organizationDTO = new OrganizationDTO()
            organization.setName("猪齿鱼")
            organization.setCode("choerodon")
            organization.setEnabled(true)

            isInit = true

            LdapDTO ldap = new LdapDTO()
            ldap.setName("choerodon")
            ldap.setOrganizationId(2L)
            ldap.setServerAddress("ldap://ac.hand-china.com")
            ldap.setObjectClass("person")

            when: "调用方法"
            int count = organizationMapper.insert(organization)
            count += organizationMapper.insert(organizationDTO)
            count += ldapMapper.insert(ldap)

            then: "检验插入是否成功"
            count == 3
        }
    }

    def cleanup() {
        if (needClean) {
            organizationMapper.deleteByPrimaryKey(organization)
            organizationMapper.deleteByPrimaryKey(organizationDTO)
        }
    }

    def "Create"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织id不存在]"
        paramsMap.put("organization_id", 1000L)
        def entity = restTemplate.postForEntity(BASE_PATH, ldapDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")


        when: "调用方法"
        paramsMap.put("organization_id", organizationId)
        entity = restTemplate.postForEntity(BASE_PATH, ldapDTO, LdapDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Update"() {
        given: "构造请求参数"
        def updateLdapDTO = new LdapDTO()
        BeanUtils.copyProperties(ldapDTO, updateLdapDTO)
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织id不存在]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("id", 1)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}", updateLdapDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法[异常-ldap不存在]"
        paramsMap.put("organization_id", 1)
        paramsMap.put("id", 1000)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", updateLdapDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.ldap.not.exist")

        when: "调用方法"
        paramsMap.put("organization_id", organizationId)
        paramsMap.put("id", 1)
        BeanUtils.copyProperties(ldapMapper.selectByPrimaryKey(1L), updateLdapDTO)
        updateLdapDTO.setAccount("account")
        updateLdapDTO.setPassword("password")
        updateLdapDTO.setBaseDn("base/dn")
        updateLdapDTO.setObjectClass("objectclass")
        updateLdapDTO.setCustomFilter("(filter)")
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}", updateLdapDTO, LdapDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getName() == "choerodon"
        entity.getBody().getOrganizationId() == 1L
        entity.getBody().getServerAddress() == "please edit"
        entity.getBody().getObjectClass() == "objectclass"
    }

    def "EnableLdap"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织id不匹配]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("id", 1)
        paramsMap.put("sagaBathSize", 500)
        def httpEntity = new HttpEntity<Object>()
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.ldap.organizationId.not.match")

        when: "调用方法[异常-ldap不存在]"
        paramsMap.put("organization_id", 1L)
        paramsMap.put("id", 1000)
        entity = restTemplate.exchange(BASE_PATH + "/{id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.ldap.not.exist")

        when: "调用方法"
        paramsMap.put("organization_id", 1L)
        paramsMap.put("id", 1)
        entity = restTemplate.exchange(BASE_PATH + "/{id}/enable", HttpMethod.PUT, httpEntity, LdapDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled()
    }

    def "DisableLdap"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织id不匹配]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("id", 1)
        paramsMap.put("sagaBathSize", 500)
        def httpEntity = new HttpEntity<Object>()
        def entity = restTemplate.exchange(BASE_PATH + "/{id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.ldap.organizationId.not.match")

        when: "调用方法[异常-ldap不存在]"
        paramsMap.put("organization_id", 1L)
        paramsMap.put("id", 1000)
        entity = restTemplate.exchange(BASE_PATH + "/{id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.ldap.not.exist")

        when: "调用方法"
        paramsMap.put("organization_id", 1L)
        paramsMap.put("id", 1)
        entity = restTemplate.exchange(BASE_PATH + "/{id}/disable", HttpMethod.PUT, httpEntity, LdapDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }

    def "QueryByOrgId"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织id不存在]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.getForEntity(BASE_PATH, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        paramsMap.put("organization_id", 3)
        paramsMap.put("id", 2)
        entity = restTemplate.getForEntity(BASE_PATH, LdapDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Delete"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def httpEntity = new HttpEntity<Object>()

        when: "调用方法[异常-组织id不存在]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("id", 2)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        paramsMap.put("organization_id", 1)
        paramsMap.put("id", 2)
        entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.DELETE, httpEntity, Boolean, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "TestConnect"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def ldapAccountDTO = new LdapAccountDTO()

        when: "调用方法[异常-组织id不存在]"
        paramsMap.put("organization_id", 1000L)
        paramsMap.put("id", 1)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}/test_connect", ldapAccountDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用方法"
        OrganizationDTO organizationDTO = new OrganizationDTO()
        organizationDTO.setCode("tets-org123sd1")
        organizationDTO.setName("name")
        organizationDTO.setEnabled(true)
        organizationMapper.insertSelective(organizationDTO)
        paramsMap.put("organization_id", organizationDTO.getId())
        paramsMap.put("id", 1)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}/test_connect", ldapAccountDTO, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.has.ldap")

        when: "调用方法"
        paramsMap.put("organization_id", 3)
        paramsMap.put("id", 3)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}/test_connect", ldapAccountDTO, LdapConnectionDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "SyncUsers"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[异常-组织不存在]"
        paramsMap.put("organization_id", 1000)
        paramsMap.put("id", 3)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.postForEntity(BASE_PATH + "/{id}/sync_users", Void, ExceptionResponse, paramsMap)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.notFound")

        when: "调用方法"
        paramsMap.put("organization_id", 1)
        paramsMap.put("id", 1)
        entity = restTemplate.postForEntity(BASE_PATH + "/{id}/sync_users", Void, Void, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "LatestHistory"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法"
        paramsMap.put("organization_id", 3)
        paramsMap.put("id", 3)
        paramsMap.put("sagaBathSize", 500)
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}/latest_history", LdapHistoryDTO, paramsMap)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "stop"() {
        given: "新建一个ldapHistory"
        LdapHistoryDTO ldapHistory = new LdapHistoryDTO()
        ldapHistory.setLdapId(1L)
        ldapHistory.setSyncBeginTime(new Date(System.currentTimeMillis()))
        ldapHistoryMapper.insertSelective(ldapHistory)
        LdapHistoryDTO returnValue = ldapHistoryMapper.selectByPrimaryKey(ldapHistory)
        long id = returnValue.getId()

        when: "调用controller"
        def entity = restTemplate.exchange("/v1/organizations/1/ldaps/" + id + "/stop", HttpMethod.PUT, HttpEntity.EMPTY, LdapHistoryDTO)

        then: "校验"
        entity.statusCode.is2xxSuccessful()
        entity.body.syncEndTime != null
    }

    @Transactional
    def "pagingQueryHistories"() {
        given:
        LdapService ldapService = new LdapServiceImpl(null, null, null, null, null, ldapHistoryMapper, null)
        LdapController ldapController = new LdapController(ldapService)
//        PageRequest pageRequest = new PageRequest(0, 10)
        LdapHistoryDTO ldapHistory = new LdapHistoryDTO()
        ldapHistory.setLdapId(1L)
        ldapHistoryMapper.insertSelective(ldapHistory)

        when:
        def entity = ldapController.pagingQueryHistories(0, 10, 1L, 1L)

        then:
        entity.statusCode.is2xxSuccessful()
        entity.body.total == 1

    }

    def "pagingQueryErrorUsers"() {
        given:
        LdapService ldapService = new LdapServiceImpl(null, null, null, null, null, null, ldapErrorUserMapper)
        LdapController ldapController = new LdapController(ldapService)
//        PageRequest pageRequest = new PageRequest(0, 10)

        LdapErrorUserDTO ldapErrorUser = new LdapErrorUserDTO()
        ldapErrorUser.setLdapHistoryId(1L)
        ldapErrorUser.setUuid("uuid")
        ldapErrorUser.setCause(LdapErrorUserCause.EMAIL_ALREADY_EXISTED.value())
        ldapErrorUserMapper.insertSelective(ldapErrorUser)

        when:
        def entity = ldapController.pagingQueryErrorUsers(0, 10, 1L, null)

        then:
        entity.statusCode.is2xxSuccessful()
        entity.body.total == 1
    }
}
