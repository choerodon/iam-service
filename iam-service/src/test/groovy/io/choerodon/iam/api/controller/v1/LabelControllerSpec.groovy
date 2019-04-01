package io.choerodon.iam.api.controller.v1

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.LabelDTO
import io.choerodon.iam.infra.mapper.LabelMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LabelControllerSpec extends Specification {
    private static String BASE_PATH = "/v1/labels"

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    private LabelMapper labelMapper

    def "ListByType"() {
        given: "构造请求参数"
        def paramsMap = new HashMap<String, Object>()
        paramsMap.put("level", "project")

        when: "调用插入方法"
        def entity = restTemplate.getForEntity(BASE_PATH+"?level={level}", List, paramsMap)

        then: "校验结果[project层级结果]"
        entity.statusCode.is2xxSuccessful()
        entity.getBody().size() == 6

        when: "调用插入方法"
        entity = restTemplate.getForEntity(BASE_PATH, List)

        then: "校验结果[所有结果]"
        entity.statusCode.is2xxSuccessful()
    }
}
