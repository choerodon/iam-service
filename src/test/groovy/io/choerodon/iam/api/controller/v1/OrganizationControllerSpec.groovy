package io.choerodon.iam.api.controller.v1

import com.github.pagehelper.PageInfo
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.OrganizationService
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.mapper.OrganizationMapper
import org.springframework.beans.BeanUtils
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
class OrganizationControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/organizations"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private OrganizationMapper organizationMapper
    @Autowired
    private OrganizationService organizationService
    @Shared
    def needInit = true
    @Shared
    def needClean = false
    @Shared
    def organizationDOList = new ArrayList<OrganizationDTO>()

    def setup() {
        if (needInit) {
            given: "构造参数"
            for (int i = 0; i < 3; i++) {
                def organizationDO = new OrganizationDTO()
                organizationDO.setCode("hand" + i)
                organizationDO.setName("汉得" + i)
                organizationDOList.add(organizationDO)
            }

            when: "调用方法"
            needInit = false
            int count = 0
            for (OrganizationDTO dto : organizationDOList) {
                organizationMapper.insert(dto)
                count++
            }

            then: "校验结果"
            count == 3
        }

    }

    def cleanup() {
        if (needClean) {
            when: "调用方法"
            needClean = false
            def count = 0
            for (OrganizationDTO organizationDO : organizationDOList) {
                count += organizationMapper.deleteByPrimaryKey(organizationDO)
            }

            then: "校验结果"
            count == 3
        }
    }

    def "Update"() {
        given: "构造请求参数"
        def updateDto = organizationDOList.get(0)
        updateDto.setCode("update-hand")
        updateDto.setName("汉得更新")
        updateDto.setObjectVersionNumber(1)
        def httpEntity = new HttpEntity<Object>(updateDto)

        when: "调用对应方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{organization_id}", HttpMethod.PUT, httpEntity, OrganizationDTO, updateDto.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        //code不可更新
        !entity.getBody().getCode().equals(updateDto.getCode())
        entity.getBody().getId().equals(updateDto.getId())
        entity.getBody().getName().equals(updateDto.getName())
    }

    def "Query"() {
        given: "构造请求参数"
        def organizationId = 1L
        def organizationDO = organizationMapper.selectByPrimaryKey(organizationId)

        when: "调用对应方法[异常-组织id不存在]"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{organization_id}", ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        entity = restTemplate.getForEntity(BASE_PATH + "/{organization_id}", OrganizationDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(organizationId)
        entity.getBody().getCode().equals(organizationDO.getCode())
        entity.getBody().getName().equals(organizationDO.getName())
    }

    def "QueryOrgLevel"() {
        given: "构造请求参数"
        def organizationId = 1L
        def organizationDO = organizationMapper.selectByPrimaryKey(organizationId)

        when: "调用对应方法[异常-组织id不存在]"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{organization_id}/org_level", ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        entity = restTemplate.getForEntity(BASE_PATH + "/{organization_id}/org_level", OrganizationDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(organizationId)
        entity.getBody().getCode().equals(organizationDO.getCode())
        entity.getBody().getName().equals(organizationDO.getName())
    }

    def "List"() {
        given: "构造请求参数"
        def name = "汉得"
        def code = "hand"

        when: "调用对应方法[全查询]"
        def entity = restTemplate.getForEntity(BASE_PATH, PageInfo)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
//        entity.getBody().total == 4
        !entity.getBody().list.isEmpty()

        when: "调用对应方法"
        entity = restTemplate.getForEntity(BASE_PATH + "?code={code}&name={name}", PageInfo, code, name)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().total == 3
    }

    def "EnableOrganization"() {
        given: "构造请求参数"
        def organizationId = 1L
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法[异常-组织id不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/{organization_id}/enable", HttpMethod.PUT, httpEntity, ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        entity = restTemplate.exchange(BASE_PATH + "/{organization_id}/enable", HttpMethod.PUT, httpEntity, OrganizationDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getEnabled()
    }

    def "DisableOrganization"() {
        given: "构造请求参数"
        def organizationId = 1L
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法[异常-组织id不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/{organization_id}/disable", HttpMethod.PUT, httpEntity, ExceptionResponse, 1000L)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.not.exist")

        when: "调用对应方法"
        entity = restTemplate.exchange(BASE_PATH + "/{organization_id}/disable", HttpMethod.PUT, httpEntity, OrganizationDTO, organizationId)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        !entity.getBody().getEnabled()
    }

    def "Check"() {
        given: "构造请求参数"
        def organizationDTO = organizationDOList.get(1)

        when: "调用对应方法[异常-组织code为空]"
        def organizationDTO1 = new OrganizationDTO()
        BeanUtils.copyProperties(organizationDTO, organizationDTO1)
        organizationDTO1.setCode(null)
        def entity = restTemplate.postForEntity(BASE_PATH + "/check", organizationDTO1, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.code.empty")

        when: "调用对应方法[异常-组织id存在]"
        def organizationDTO2 = new OrganizationDTO()
        BeanUtils.copyProperties(organizationDTO, organizationDTO2)
        organizationDTO2.setCode("operation")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", organizationDTO2, ExceptionResponse)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.organization.code.exist")

        when: "调用对应方法"
        def organizationDTO3 = new OrganizationDTO()
        organizationDTO3.setCode("test")
        entity = restTemplate.postForEntity(BASE_PATH + "/check", organizationDTO3, Void)
        needClean = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "queryByIds"() {
        given:
        OrganizationController controller = new OrganizationController(organizationService)
        def ids = new HashSet()
        ids << 1L

        when:
        def value = controller.queryByIds(ids)
        then:
        value.body.size() > 0
    }
}
