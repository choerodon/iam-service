package io.choerodon.iam.api.controller.v1

import io.choerodon.core.domain.Page
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.AccessTokenService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Import
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import spock.lang.Specification
import spock.lang.Stepwise

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author Eugen
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
@Stepwise
class AccessTokenControllerSpec extends Specification {
    private static String BASE_PATH = "/v1/token"

    @Autowired
    private TestRestTemplate restTemplate

    private AccessTokenService accessTokenService = Mock(AccessTokenService)

    AccessTokenController accessTokenController = new AccessTokenController(accessTokenService)

    def "List"() {
        given: "参数准备"
        def currentToken = "currentToken"
        when: "调用方法"
        def entity = restTemplate.getForEntity(BASE_PATH + "?currentToken={currentToken}", Page, currentToken)
        then: "结果比对"
        entity.statusCode.is2xxSuccessful()
    }

    def "Delete"() {
        given: "参数准备"
        HttpEntity<Object> httpEntity = new HttpEntity<>()
        def tokenId = "tokenId"
        def currentToken = "currentToken"

        when: "调用方法"
        def entity = restTemplate.exchange(BASE_PATH + "?tokenId={tokenId}&currentToken={currentToken}", HttpMethod.DELETE, httpEntity, Void, tokenId, currentToken)

        then: "校验结果"
        entity.statusCode.is2xxSuccessful()
    }
}
