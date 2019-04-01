package io.choerodon.iam.infra.common.utils

import io.choerodon.iam.IntegrationTestConfiguration
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ParamUtilsSpec extends Specification {
    def "ArrToStr"() {
        given: "构造请求参数"
        String[] params = new String[2]
        params[0] = "param"
        params[1] = "param1"

        when: "调用方法"
        String result = ParamUtils.arrToStr(params)

        then: "校验结果"
        result.equals(params[0] + "," + params[1] + ",")
    }
}
