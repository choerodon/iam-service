package io.choerodon.iam.api.controller.v1

import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LdapAccountDTO
import io.choerodon.iam.api.dto.LdapConnectionDTO
import io.choerodon.iam.api.dto.LdapDTO
import io.choerodon.iam.api.dto.LdapHistoryDTO
import io.choerodon.iam.app.service.LdapService
import io.choerodon.iam.app.service.impl.LdapServiceImpl
import io.choerodon.iam.domain.repository.LdapHistoryRepository
import io.choerodon.iam.domain.service.ILdapService
import io.choerodon.iam.infra.dataobject.LdapDO
import io.choerodon.iam.infra.dataobject.LdapErrorUserDO
import io.choerodon.iam.infra.dataobject.LdapHistoryDO
import io.choerodon.iam.infra.dataobject.OrganizationDO
import io.choerodon.iam.infra.enums.LdapErrorUserCause
import io.choerodon.iam.infra.mapper.LdapErrorUserMapper
import io.choerodon.iam.infra.mapper.LdapMapper
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.mybatis.pagehelper.domain.PageRequest
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
 * @author dengyouquan
 * */
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
    private LdapHistoryRepository ldapHistoryRepository

    private ILdapService iLdapService = Mock(ILdapService)

    //设置为共享，以免每个方法使用false，调用
    @Shared
    def isInit = false
    @Shared
    def needClean = false
    def ldapDTO = new LdapDTO()
    @Shared
    def organizationId = 1L
    @Shared
    OrganizationDO organizationDO
    @Shared
    def organizationDO1

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
            organizationDO = new OrganizationDO()
            organizationDO.setName("汉得")
            organizationDO.setCode("hand")
            organizationDO.setEnabled(true)
            organizationDO1 = new OrganizationDO()
            organizationDO.setName("猪齿鱼")
            organizationDO.setCode("choerodon")
            organizationDO.setEnabled(true)

            isInit = true

            LdapDO ldapDO = new LdapDO()
            ldapDO.setName("choerodon")
            ldapDO.setOrganizationId(2L)
            ldapDO.setServerAddress("ldap://ac.hand-china.com")
            ldapDO.setObjectClass("person")

            when: "调用方法"
            int count = organizationMapper.insert(organizationDO)
            count += organizationMapper.insert(organizationDO1)
            count += ldapMapper.insert(ldapDO)

            then: "检验插入是否成功"
            count == 3
        }
    }

    def cleanup() {
        if (needClean) {
            organizationMapper.deleteByPrimaryKey(organizationDO)
            organizationMapper.deleteByPrimaryKey(organizationDO1)
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
        OrganizationDO organizationDO2 = new OrganizationDO()
        organizationDO2.setCode("tets-org123sd1")
        organizationDO2.setName("name")
        organizationDO2.setEnabled(true)
        organizationMapper.insertSelective(organizationDO2)
        paramsMap.put("organization_id", organizationDO2.getId())
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
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()
        ldapHistoryDO.setLdapId(1L)
        ldapHistoryDO.setSyncBeginTime(new Date(System.currentTimeMillis()))
        LdapHistoryDO returnValue = ldapHistoryRepository.insertSelective(ldapHistoryDO)
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
        LdapService ldapService = new LdapServiceImpl(null, null, null, null, null, ldapHistoryRepository, null)
        LdapController ldapController = new LdapController(ldapService)
        PageRequest pageRequest = new PageRequest(0, 10)
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()
        ldapHistoryDO.setLdapId(1L)
        ldapHistoryRepository.insertSelective(ldapHistoryDO)

        when:
        def entity = ldapController.pagingQueryHistories(pageRequest, 1L, 1L)

        then:
        entity.statusCode.is2xxSuccessful()
        entity.body.totalElements == 2L

    }

    def "pagingQueryErrorUsers"() {
        given:
        LdapService ldapService = new LdapServiceImpl(null, null, null, null, null, null, ldapErrorUserMapper)
        LdapController ldapController = new LdapController(ldapService)
        PageRequest pageRequest = new PageRequest(0, 10)

        LdapErrorUserDO ldapErrorUserDO = new LdapErrorUserDO()
        ldapErrorUserDO.setLdapHistoryId(1L)
        ldapErrorUserDO.setUuid("uuid")
        ldapErrorUserDO.setCause(LdapErrorUserCause.EMAIL_ALREADY_EXISTED.value())
        ldapErrorUserMapper.insertSelective(ldapErrorUserDO)

        when:
        def entity = ldapController.pagingQueryErrorUsers(pageRequest, 1L)

        then:
        entity.statusCode.is2xxSuccessful()
        entity.body.totalElements == 1L
    }
}
