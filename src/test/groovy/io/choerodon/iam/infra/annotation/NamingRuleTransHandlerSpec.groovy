package io.choerodon.iam.infra.annotation

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.api.dto.ProjectDTO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.core.MethodParameter
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.ModelAndViewContainer
import spock.lang.Specification

import javax.servlet.http.HttpServletRequest

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class NamingRuleTransHandlerSpec extends Specification {
    private NamingRuleTransHandler namingRuleTransHandler = new NamingRuleTransHandler()

    def "ResolveArgument"() {
        given: "构造请求参数"
        MethodParameter methodParameter = Mock(MethodParameter)
        ModelAndViewContainer mavContainer = Mock(ModelAndViewContainer)
        NativeWebRequest nativeWebRequest = Mock(NativeWebRequest)
        WebDataBinderFactory binderFactory = Mock(WebDataBinderFactory)
        HttpServletRequest servletRequest = Mock(HttpServletRequest)
        NamingRuleTrans namingRuleTrans = Mock(NamingRuleTrans)
        NamingRuleTransStrategy strategy = NamingRuleTransStrategy.CAMEL
        Map<String, String[]> parameterMap = new HashMap<>()
        String[] strings = new String[1]
        strings[0] = "1"
        parameterMap.put("organization_id", strings)

        when: "调用方法"
        namingRuleTransHandler.resolveArgument(methodParameter, mavContainer, nativeWebRequest, binderFactory)

        then: "校验结果"
        1 * nativeWebRequest.getNativeRequest(_) >> { servletRequest }
        1 * servletRequest.getContentType() >> { "xml" }
        1 * servletRequest.getMethod() >> { "GET" }
        2 * methodParameter.getParameterType() >> { ProjectDTO }
        1 * methodParameter.getParameterAnnotation(NamingRuleTrans.class) >> { namingRuleTrans }
        1 * namingRuleTrans.value() >> { strategy }
        1 * nativeWebRequest.getParameterMap() >> { parameterMap }

        when: "调用方法"
        strategy = NamingRuleTransStrategy.UNDER_LINE
        namingRuleTransHandler.resolveArgument(methodParameter, mavContainer, nativeWebRequest, binderFactory)

        then: "校验结果"
        1 * nativeWebRequest.getNativeRequest(_) >> { servletRequest }
        1 * servletRequest.getContentType() >> { "xml" }
        1 * servletRequest.getMethod() >> { "GET" }
        2 * methodParameter.getParameterType() >> { ProjectDTO }
        1 * methodParameter.getParameterAnnotation(NamingRuleTrans.class) >> { namingRuleTrans }
        1 * namingRuleTrans.value() >> { strategy }
        1 * nativeWebRequest.getParameterMap() >> { parameterMap }
    }
}
