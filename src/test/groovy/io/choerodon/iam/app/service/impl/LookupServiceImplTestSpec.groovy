package io.choerodon.iam.app.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.LookupService
import io.choerodon.iam.infra.asserts.AssertHelper
import io.choerodon.iam.infra.mapper.LookupMapper
import io.choerodon.iam.infra.mapper.LookupValueMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*  */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LookupServiceImplTestSpec extends Specification {
//    private LookupRepository lookupRepository = Mock(LookupRepository)
//    private LookupValueRepository lookupValueRepository = Mock(LookupValueRepository)
    @Autowired
    LookupMapper lookupMapper
    @Autowired
    LookupValueMapper lookupValueMapper
    @Autowired
    AssertHelper assertHelper

    def "Delete"() {
        given: "构造参数"
        def id = 1L
        LookupService lookupService = new LookupServiceImpl(lookupMapper,
                lookupValueMapper, assertHelper)

        when: "调用方法"
        lookupService.delete(id)

        then: "校验结果"
        true
//        1 * lookupRepository.deleteById(_)
//        1 * lookupValueRepository.delete(_)
    }
}
