package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.iam.entity.LookupE
import io.choerodon.iam.domain.iam.entity.LookupValueE
import io.choerodon.iam.domain.repository.LookupRepository
import io.choerodon.iam.domain.repository.LookupValueRepository
import io.choerodon.iam.domain.service.ILookupService
import io.choerodon.iam.infra.dataobject.LookupValueDO
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ILookupServiceImplSpec extends Specification {
    private LookupRepository lookupRepository = Mock(LookupRepository)
    private LookupValueRepository lookupValueRepository = Mock(LookupValueRepository)
    private ILookupService iLookupService
    private int count = 3

    def setup() {
        iLookupService = new ILookupServiceImpl(lookupRepository, lookupValueRepository)
    }

    def "Create"() {
        given: "构造请求参数"
        LookupE lookupE = new LookupE()
        List<LookupValueE> lookupValueEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueE lookupValueE = new LookupValueE()
            lookupValueE.setCode("code" + i)
            lookupValueEList.add(lookupValueE)
        }
        lookupE.setLookupValues(lookupValueEList)

        when: "调用方法"
        iLookupService.create(lookupE)

        then: "校验结果"
        1 * lookupRepository.insert(_) >> { lookupE }
        count * lookupValueRepository.insert(_) >> { new LookupValueE() }
    }

    def "Delete"() {
        given: "构造请求参数"
        def id = 1L
        List<LookupValueDO> lookupValueDOS = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDO lookupValueDO = new LookupValueDO()
            lookupValueDOS.add(lookupValueDO)
        }

        when: "调用方法"
        iLookupService.delete(id)

        then: "校验结果"
        1 * lookupRepository.delete(_)
        1 * lookupValueRepository.selectByLookupId(_) >> { lookupValueDOS }
        count * lookupValueRepository.deleteById(_)
    }

    def "Update"() {
        given: "构造请求参数"
        LookupE lookupE = new LookupE()
        List<LookupValueE> lookupValueEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueE lookupValueE = new LookupValueE()
            lookupValueE.setId(i)
            lookupValueE.setCode("code" + i)
            lookupValueEList.add(lookupValueE)
        }
        List<LookupValueDO> lookupValueDOList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDO lookupValueDO = new LookupValueDO()
            lookupValueDO.setId(i)
            lookupValueDO.setCode("code" + i)
            lookupValueDOList.add(lookupValueDO)
        }
        lookupE.setLookupValues(lookupValueEList)

        when: "调用方法"
        iLookupService.update(lookupE)

        then: "校验结果"
        1 * lookupRepository.update(_, _) >> { lookupE }
        1 * lookupValueRepository.selectByLookupId(_) >> { lookupValueDOList }
        count * lookupValueRepository.updateById(_, _) >> { new LookupValueE() }
    }

    def "QueryByCode"() {
        given: "构造请求参数"
        LookupE lookupE = new LookupE()
        lookupE.setCode("code")
        List<LookupValueE> lookupValueEList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueE lookupValueE = new LookupValueE()
            lookupValueE.setCode("code" + i)
            lookupValueEList.add(lookupValueE)
        }
        lookupE.setLookupValues(lookupValueEList)
        List<LookupE> lookupEs = new ArrayList<>()
        lookupEs.add(lookupE)

        when: "调用方法"
        iLookupService.queryByCode(lookupE)

        then: "校验结果"
        1 * lookupRepository.select(_) >> { lookupEs }
        1 * lookupValueRepository.selectByLookupId(_) >> { new ArrayList<LookupValueDO>() }
    }
}