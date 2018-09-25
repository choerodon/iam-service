package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.core.exception.ExceptionResponse
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LanguageDTO
import io.choerodon.iam.infra.mapper.LanguageMapper
import org.springframework.beans.BeanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LanguageControllerSpec extends Specification {
    private static String BASE_PATH = "/v1/languages"

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private LanguageMapper languageMapper

    def "Update"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        def languageDO = languageMapper.selectByPrimaryKey(1L);
        def httpEntity = null;
        paramsMap.put("id", languageDO.getId())

        when: "调用方法[异常-版本号为空]"
        def languageDTO1 = new LanguageDTO()
        BeanUtils.copyProperties(languageDO, languageDTO1)
        languageDTO1.setObjectVersionNumber(null)
        httpEntity = new HttpEntity<LanguageDTO>(languageDTO1)
        def entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.language.objectVersionNumber.empty")

        when: "调用方法[异常-id不存在]"
        def languageDTO2 = new LanguageDTO()
        BeanUtils.copyProperties(languageDO, languageDTO2)
        paramsMap.put("id", 1000)
        httpEntity = new HttpEntity<LanguageDTO>(languageDTO2)
        entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.language.not.exist")

        when: "调用方法[异常-code不存在]"
        paramsMap.put("id", 1L)
        def languageDTO3 = new LanguageDTO()
        BeanUtils.copyProperties(languageDO, languageDTO3)
        languageDTO3.setCode(null)
        httpEntity = new HttpEntity<LanguageDTO>(languageDTO3)
        entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.code.empty")

        when: "调用方法[异常-name长度太长]"
        def languageDTO4 = new LanguageDTO()
        BeanUtils.copyProperties(languageDO, languageDTO4)
        languageDTO4.setName("namenamenamenamenamenamenamenamenamenamenamenamename")
        httpEntity = new HttpEntity<LanguageDTO>(languageDTO4)
        entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, ExceptionResponse, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getCode().equals("error.name.length")

        when: "调用方法"
        def languageDTO5 = new LanguageDTO()
        BeanUtils.copyProperties(languageDO, languageDTO5)
        httpEntity = new HttpEntity<LanguageDTO>(languageDTO5)
        entity = restTemplate.exchange(BASE_PATH + "/{id}", HttpMethod.PUT, httpEntity, LanguageDTO, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().getId().equals(languageDO.getId())
        entity.getBody().getCode().equals(languageDO.getCode())
        entity.getBody().getName().equals(languageDO.getName())
        entity.getBody().getDescription().equals(languageDO.getDescription())
    }

    def "PagingQuery"() {
        given: "构造参数列表"
        def paramsMap = new HashMap<String, Object>()

        when: "调用方法[全查询]"
        def entity = restTemplate.getForEntity(BASE_PATH, Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.body.getTotalPages() == 1
        entity.body.getTotalElements() == 2
        entity.getBody().size() == 2

        when: "调用方法[带参数查询]"
        paramsMap.put("code", "zh_CN")
        entity = restTemplate.getForEntity(BASE_PATH + "?code={code}", Page, paramsMap)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
        entity.body.getTotalPages() == 1
        entity.body.getTotalElements() == 1
        entity.getBody().size() == 1
    }

    def "ListAll"() {
    }

    def "QueryByCode"() {
    }
}
