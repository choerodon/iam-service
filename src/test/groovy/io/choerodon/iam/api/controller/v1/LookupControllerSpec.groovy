package io.choerodon.iam.api.controller.v1

import com.github.pagehelper.PageInfo
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.infra.dto.LookupDTO
import io.choerodon.iam.infra.mapper.LookupMapper
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
    def lookupDTOList = new ArrayList<LookupDTO>()

    def setup() {
        if (!isInit) {
            given: "构造参数"
            for (int i = 0; i < 3; i++) {
                def lookup = new LookupDTO()
                lookup.setCode("hand" + i)
                lookup.setDescription("hand-china" + i)
                lookupDTOList.add(lookup)
            }

            when: "插入数据"
            isInit = true
            int count = 0;
            for (LookupDTO dto : lookupDTOList) {
                lookupMapper.insert(dto)
                count++
            }

            then: "校验结果"
            count == 3
        }
    }

    def cleanup() {
        if (needClear) {
            when: "调用方法"
            needClear = false
            def count = 0
            for (LookupDTO lookup : lookupDTOList) {
                count += lookupMapper.deleteByPrimaryKey(lookup)
            }

            then: "校验结果"
            count == 3
        }
    }

    @Transactional
    def "Create"() {
        given: "构造请求参数"
        def createdDto = new LookupDTO()
        createdDto.setCode("choerodon")
        createdDto.setDescription("choerodon")

        when: "调用对应方法"
        def entity = restTemplate.postForEntity(BASE_PATH, createdDto, LookupDTO)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals(createdDto.getCode())
        entity.getBody().getDescription().equals(createdDto.getDescription())
        lookupMapper.deleteByPrimaryKey(entity.getBody().getId())
    }

    @Transactional
    def "Delete"() {
        given: "构造请求参数"
        def httpEntity = new HttpEntity<Object>()

        when: "调用对应方法"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.DELETE, httpEntity, String, lookupDTOList.get(0).getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }

    @Transactional
    def "Update[Exception]"() {
        given: "构造请求参数"
        def updatedDto = new LookupDTO()
        BeanUtils.copyProperties(lookupDTOList.get(1), updatedDto)
        updatedDto.setCode("update")
        def httpEntity = new HttpEntity<Object>(updatedDto)

        when: "调用对应方法[异常-版本号不存在]"
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, updatedDto.getId())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.repo.lookup.update")
    }

    @Transactional
    def "Update"() {
        given: "构造请求参数"
        def updatedDto = new LookupDTO()
        BeanUtils.copyProperties(lookupDTOList.get(1), updatedDto)
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
        def entity = restTemplate.getForEntity(BASE_PATH + "?code={code}", PageInfo, code)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().list.size() == 0
    }

    def "ListByCode"() {
        when: "调用对应方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/code?value={code}", LookupDTO, lookupDTOList.get(2).getCode())

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody() == null
    }

    def "QueryById"() {
        when: "调用对应方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "/{id}", LookupDTO, 1L)
        needClear = true

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
