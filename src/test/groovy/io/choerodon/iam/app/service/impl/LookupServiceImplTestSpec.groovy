package io.choerodon.iam.app.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.LookupService
import io.choerodon.iam.domain.iam.entity.LookupE
import io.choerodon.iam.domain.repository.LookupRepository
import io.choerodon.iam.domain.repository.LookupValueRepository
import io.choerodon.iam.domain.service.ILookupService
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LookupServiceImplTestSpec extends Specification {
    private ILookupService service = Mock(ILookupService)
    private LookupRepository lookupRepository = Mock(LookupRepository)
    private LookupValueRepository lookupValueRepository = Mock(LookupValueRepository)

    private LookupService lookupService = new LookupServiceImpl(service,
            lookupRepository, lookupValueRepository)

    def "Delete"() {
        given: "构造参数"
        def id = 1L

        when: "调用方法"
        lookupService.delete(id)

        then: "校验结果"
        1 * lookupRepository.deleteById(_)
        1 * lookupValueRepository.delete(_)
    }

    def "QueryByCode"() {
        given: "构造参数"
        def code = "code"

        when: "调用方法"
        lookupService.queryByCode(code)

        then: "校验结果"
        1 * service.queryByCode(_) >> { new LookupE() }
    }
}
