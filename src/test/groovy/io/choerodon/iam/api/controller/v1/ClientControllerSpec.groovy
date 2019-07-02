package io.choerodon.iam.api.controller.v1

import com.github.pagehelper.PageInfo
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ClientCreateDTO
import io.choerodon.iam.infra.dto.ClientDTO
import io.choerodon.iam.infra.mapper.ClientMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Shared
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan* */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ClientControllerSpec extends Specification {
    private static String BASE_PATH = "/v1/organizations/{organization_id}/clients"

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private ClientMapper clientMapper

    @Shared
    private List<ClientDTO> clientDOList = new ArrayList<>();
    @Shared
    def notExistOrganizationId = 300
    @Shared
    def organizationId = 1
    @Shared
    def orgIdNotExistsClientDTO
    @Shared
    def nameExistsClientDTO
    @Shared
    def isInit = false
    @Shared
    def isClear = true

    def setup() {
        if (!isInit) {
            given: "初始化数据，切记client数据库有两条localhost和client数据，勿重合"
            for (int i = 0; i < 5; i++) {
                ClientDTO clientDO = new ClientDTO()
                clientDO.setName("choerodon" + i)
                clientDO.setOrganizationId(1)
                clientDO.setAuthorizedGrantTypes("password,implicit,client_credentials,authorization_code,refresh_token")
                clientDO.setSecret("secret")
                clientDOList.add(clientDO)
            }
            for (int i = 0; i < 5; i++) {
                ClientDTO clientDO = new ClientDTO()
                clientDO.setName("client" + i)
                clientDO.setOrganizationId(2)
                clientDO.setAuthorizedGrantTypes("password,implicit,client_credentials,authorization_code,refresh_token")
                clientDO.setSecret("secret")
                clientDOList.add(clientDO)
            }
            and: "构造异常插入数据"
            orgIdNotExistsClientDTO = new ClientDTO()
            orgIdNotExistsClientDTO.setName("error")
            orgIdNotExistsClientDTO.setOrganizationId(notExistOrganizationId)
            orgIdNotExistsClientDTO.setAuthorizedGrantTypes("password,implicit,client_credentials,authorization_code,refresh_token")
            orgIdNotExistsClientDTO.setSecret("secret")
            nameExistsClientDTO = new ClientDTO()
            nameExistsClientDTO.setName("client0")
            nameExistsClientDTO.setAuthorizedGrantTypes("password,implicit,client_credentials,authorization_code,refresh_token")
            nameExistsClientDTO.setSecret("secret")

            when: "批量插入"
            int count = 0
            for (ClientDTO dto : clientDOList) {
                clientMapper.insert(dto)
                count++
            }

            then: "校验是否插入成功"
            count == 10

            isInit = true
        }
    }

    def cleanup() {
        if (!isClear) {
            when: '批量删除dashboard'
            def count = 0;
            for (ClientDTO clientDO : clientDOList) {
                count = count + clientMapper.deleteByPrimaryKey(clientDO)
            }

            then: '批量删除成功'
            count == 10
        }
    }

    def "Create"() {
        given: "构造请求参数"
        def paramMap = new HashMap<String, Object>()
        def tempOrganizationId = 1
        paramMap.put("organization_id", tempOrganizationId)
        def clientDTO = new ClientDTO()
        clientDTO.setName("insertclient")
        clientDTO.setOrganizationId(tempOrganizationId)
        clientDTO.setAuthorizedGrantTypes("password,implicit,client_credentials,authorization_code,refresh_token")
        clientDTO.setSecret("secret")

        when: "调用插入方法"
        def entity = restTemplate.postForEntity(BASE_PATH, clientDTO, ClientDTO, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getName().equals(clientDTO.getName())
        entity.getBody().getOrganizationId().equals(clientDTO.getOrganizationId())
        entity.getBody().getSecret().equals(clientDTO.getSecret())
        entity.getBody().getAuthorizedGrantTypes().equals(clientDTO.getAuthorizedGrantTypes())
        clientMapper.deleteByPrimaryKey(entity.getBody().getId())

        when: "调用插入方法[异常-组织id不存在]"
        paramMap.put("organization_id", notExistOrganizationId)
        entity = restTemplate.postForEntity(BASE_PATH, orgIdNotExistsClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.notFound")

        when: "调用插入方法[异常-name重复]"
        paramMap.put("organization_id", organizationId)
        entity = restTemplate.postForEntity(BASE_PATH, nameExistsClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.clientName.exist")
    }

    def "CreateInfo"() {
        given: "准备参数"
        def paramMap = new HashMap<String, Object>()
        def organizationId = 1L
        paramMap.put("organization_id", organizationId)
        when: "调用createInfo方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/createInfo", ClientCreateDTO, paramMap)
        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Update"() {
        given: "构造参数"
        def updateClientDTO = clientDOList.get(4)
        def paramMap = new HashMap<String, Object>()
        paramMap.put("organization_id", organizationId)
        paramMap.put("client_id", updateClientDTO.getId())

        when: "调用更新方法[异常-名字为空]"
        updateClientDTO.setName(null)
        def entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.clientName.null")

        when: "调用更新方法[异常-client_id不存在]"
        updateClientDTO.setName("update-client")
        paramMap.put("client_id", 200)
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.client.not.exist")

        when: "调用更新方法[异常-org_id不相同]"
        paramMap.put("organization_id", notExistOrganizationId)
        paramMap.put("client_id", updateClientDTO.getId())
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organizationId.not.same")

        when: "调用更新方法[异常-client_name存在]"
        paramMap.put("organization_id", organizationId)
        updateClientDTO.setName("localhost")
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.clientName.exist")

        when: "调用更新方法[异常-AdditionalInformation格式异常]"
        updateClientDTO.setName("update-client")
        updateClientDTO.setAdditionalInformation("dfas")
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.client.additionalInfo.notJson")

        when: "调用更新方法[异常-版本号没有]"
        updateClientDTO.setAdditionalInformation(null)
        updateClientDTO.setOrganizationId(organizationId)
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
//        entity.getBody().getCode().equals("error.client.update")

        when: "调用更新方法"
        updateClientDTO.setObjectVersionNumber(1)
        entity = restTemplate.postForEntity(BASE_PATH + "/{client_id}", updateClientDTO, ClientDTO, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
//        entity.getBody().getId().equals(updateClientDTO.getId())
//        entity.getBody().getSecret().equals(updateClientDTO.getSecret())
//        entity.getBody().getAuthorizedGrantTypes().equals(updateClientDTO.getAuthorizedGrantTypes())
//        entity.getBody().getName().equals(updateClientDTO.getName())
    }

    def "Delete"() {
        given: "构造参数"
        def deleteClientDTO = clientDOList.get(0)
        def paramMap = new HashMap<String, Object>()
        paramMap.put("organization_id", 1)
        paramMap.put("client_id", deleteClientDTO.getId())
        def httpEntity = new HttpEntity<Object>()

        when: "调用方法-[异常-orgid不相同]"
        paramMap.put("organization_id", notExistOrganizationId)
        def entity = restTemplate.exchange(BASE_PATH + "/{client_id}", HttpMethod.DELETE, httpEntity, ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organizationId.not.same")

        when: "调用方法"
        paramMap.put("organization_id", organizationId)
        entity = restTemplate.exchange(BASE_PATH + "/{client_id}", HttpMethod.DELETE, httpEntity, Boolean, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody()
    }

    def "Query"() {
        given: "构造参数"
        def queryClientDTO = clientDOList.get(3)
        def paramMap = new HashMap<String, Object>()
        paramMap.put("organization_id", 1)
        paramMap.put("client_id", queryClientDTO.getId())

        when: "调用方法-[异常-client_id不存在]"
        paramMap.put("client_id", 200)
        def entity = restTemplate.getForEntity(BASE_PATH + "/{client_id}", ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.client.not.exist")

        when: "调用方法-[异常-org_id不相同]"
        paramMap.put("organization_id", notExistOrganizationId)
        paramMap.put("client_id", queryClientDTO.getId())
        entity = restTemplate.getForEntity(BASE_PATH + "/{client_id}", ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organizationId.not.same")

        when: "调用方法"
        paramMap.put("organization_id", organizationId)
        entity = restTemplate.getForEntity(BASE_PATH + "/{client_id}", ClientDTO, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(queryClientDTO.getId())
        entity.getBody().getSecret().equals(queryClientDTO.getSecret())
        entity.getBody().getAuthorizedGrantTypes().equals(queryClientDTO.getAuthorizedGrantTypes())
        entity.getBody().getName().equals(queryClientDTO.getName())
    }

    def "QueryByName"() {
        given: "构造参数"
        def queryClientDTO = clientDOList.get(3)
        def paramMap = new HashMap<String, Object>()
        paramMap.put("organization_id", organizationId)

        when: "调用方法-[异常-client_name不存在]"
        paramMap.put("client_name", "not_exist")
        def entity = restTemplate.getForEntity(BASE_PATH + "/query_by_name?client_name={client_name}", ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.client.not.exist")

        when: "调用方法[异常-组织id不同]"
        paramMap.put("client_name", queryClientDTO.getName())
        paramMap.put("organization_id", notExistOrganizationId)
        entity = restTemplate.getForEntity(BASE_PATH + "/query_by_name?client_name={client_name}", ExceptionResponse, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organizationId.not.same")

        when: "调用方法"
        paramMap.put("organization_id", organizationId)
        entity = restTemplate.getForEntity(BASE_PATH + "/query_by_name?client_name={client_name}", ClientDTO, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(queryClientDTO.getId())
        entity.getBody().getSecret().equals(queryClientDTO.getSecret())
        entity.getBody().getAuthorizedGrantTypes().equals(queryClientDTO.getAuthorizedGrantTypes())
        entity.getBody().getName().equals(queryClientDTO.getName())
    }

    def "List"() {
        given: "构造参数"
        def paramMap = new HashMap<String, Object>()
        paramMap.put("organization_id", organizationId)

        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH, PageInfo, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.body.pages == 1

        when: "调用方法-[带参数]"
        paramMap.put("name", "choerodon")
        paramMap.put("params", "choerodon")
        entity = restTemplate.getForEntity(BASE_PATH + "?name={name}&params={params}", PageInfo, paramMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.body.pages == 1
        entity.body.total == 3
    }

    def "Check"() {
        given: "构造参数"
        def clientDO = new ClientDTO()
        clientDO.setOrganizationId(1)

        when: "调用Check方法[异常-client_name为空]"
        clientDO.setName(null)
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", clientDO, ExceptionResponse, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.clientName.null")

        when: "调用Check方法[异常-client_name不存在]"
        clientDO.setName("not_exist")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", clientDO, Void, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //entity.getBody().getCode().equals("error.clientName.exist")

        when: "调用Check方法[异常-client_name不存在]"
        clientDO.setId(null)
        clientDO.setName("not_exist")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", clientDO, Void, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //entity.getBody().getCode().equals("error.clientName.exist")

        when: "调用Check方法"
        entity = restTemplate.postForEntity(BASE_PATH + "/check", clientDO, Void, organizationId)
        isClear = false

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
