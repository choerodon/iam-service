package io.choerodon.iam.api.controller.v1

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LookupDTO
import io.choerodon.iam.infra.dataobject.LookupDO
import io.choerodon.iam.infra.mapper.LookupMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
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
class LookupControllerSpec extends Specification {
    private static final String BASE_PATH = "/v1/lookups"
    @Autowired
    private TestRestTemplate restTemplate
    @Autowired
    private LookupMapper lookupMapper
    @Shared
    def isInit = false
    @Shared
    def needClear = false
    @Shared
    def lookupDOList = new ArrayList<LookupDO>()

    def setup() {
        if (!isInit) {
            given: "构造参数"
            for (int i = 0; i < 3; i++) {
                def lookupDO = new LookupDO()
                lookupDO.setCode("hand" + i)
                lookupDO.setDescription("hand-china" + i)
                lookupDOList.add(lookupDO)
            }

            when: "插入数据"
            isInit = true
            def count = lookupMapper.insertList(lookupDOList)

            then: "校验结果"
            count == 3
        }
    }

    def cleanup() {
        if (needClear) {
            when: "调用方法"
            needClear = false
            def count = 0
            for (LookupDO lookupDO : lookupDOList) {
                count += lookupMapper.deleteByPrimaryKey(lookupDO)
            }

            then: "校验结果"
            count == 3
        }
    }

    def "Create"() {
        given: "构造请求参数"
        def createdDto = new LookupDTO()
        createdDto.setCode("choerodon")
        createdDto.setDescription("choerodon")
        createdDto.setParam("params")

        when: "调用对应方法"
        def entity = restTemplate.postForEntity(BASE_PATH, createdDto, LookupDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(createdDto.getCode())
        entity.getBody().getDescription().equals(createdDto.getDescription())
        lookupMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    def "Delete"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.DELETE, httpEntity, String, lookupDOList.get(0).getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    def "Update[Exception]"() {
        given: "构造请求参数"
        def updatedDto = new LookupDTO()
        BeanUtils.copyProperties(ConvertHelper.convert(lookupDOList.get(1), LookupDTO), updatedDto)
        updatedDto.setCode("update")
        def httpEntity = new HttpEntity<Object>(updatedDto)

        when: "调用对应方法[异常-版本号不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, updatedDto.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.lookup.objectVersionNumber.empty")
    }

    def "Update"() {
        given: "构造请求参数"
        def updatedDto = new LookupDTO()
        BeanUtils.copyProperties(ConvertHelper.convert(lookupDOList.get(1), LookupDTO), updatedDto)
        updatedDto.setCode("update")
        def httpEntity = new HttpEntity<Object>(updatedDto)
        updatedDto.setId(1L)
        updatedDto.setObjectVersionNumber(1)

        when: "调用对应方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, LookupDTO, updatedDto.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(updatedDto.getCode())
        entity.getBody().getDescription().equals(updatedDto.getDescription())
    }

    def "List"() {
        given: "构造请求参数"
        def code = "hand"

        when: "调用对应方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "?code={code}", Page, code)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 3
    }

    def "ListByCode"() {
        when: "调用对应方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/code?value={code}", LookupDTO, lookupDOList.get(2).getCode())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(lookupDOList.get(2).getCode())
        entity.getBody().getDescription().equals(lookupDOList.get(2).getDescription())
    }

    def "QueryById"() {
        when: "调用对应方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}", LookupDTO, 1L)
        needClear = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
