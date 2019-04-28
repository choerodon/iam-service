package io.choerodon.iam.domain.service.impl

import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.LookupRepository
import io.choerodon.iam.domain.repository.LookupValueRepository
import io.choerodon.iam.domain.service.ILookupService
import io.choerodon.iam.infra.dto.LookupDTO
import io.choerodon.iam.infra.dto.LookupValueDTO
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
        LookupDTO lookup = new LookupDTO()
        List<LookupValueDTO> lookupValues = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDTO lookupValue = new LookupValueDTO()
            lookupValue.setCode("code" + i)
            lookupValues.add(lookupValue)
        }
        lookup.setLookupValues(lookupValues)

        when: "调用方法"
        iLookupService.create(lookup)

        then: "校验结果"
        1 * lookupRepository.insert(_) >> { lookup }
        count * lookupValueRepository.insert(_) >> { new LookupValueDTO() }
    }

    def "Delete"() {
        given: "构造请求参数"
        def id = 1L
        List<LookupValueDTO> lookupValueDOS = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDTO lookupValue = new LookupValueDTO()
            lookupValueDOS.add(lookupValue)
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
        LookupDTO lookup = new LookupDTO()
        List<LookupValueDTO> lookups = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDTO lookupValue = new LookupValueDTO()
            lookupValue.setId(i)
            lookupValue.setCode("code" + i)
            lookups.add(lookupValue)
        }
        List<LookupValueDTO> lookupValueList = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDTO lookupValue = new LookupValueDTO()
            lookupValue.setId(i)
            lookupValue.setCode("code" + i)
            lookupValueList.add(lookupValue)
        }
        lookup.setLookupValues(lookups)

        when: "调用方法"
        iLookupService.update(lookup)

        then: "校验结果"
        1 * lookupRepository.update(_, _) >> { lookup }
        1 * lookupValueRepository.selectByLookupId(_) >> { lookupValueList }
        count * lookupValueRepository.updateById(_, _) >> { new LookupValueDTO() }
    }

    def "QueryByCode"() {
        given: "构造请求参数"
        LookupDTO lookup = new LookupDTO()
        lookup.setCode("code")
        List<LookupValueDTO> lookupValues = new ArrayList<>()
        for (int i = 0; i < count; i++) {
            LookupValueDTO lookupValue = new LookupValueDTO()
            lookupValue.setCode("code" + i)
            lookupValues.add(lookupValue)
        }
        lookup.setLookupValues(lookupValues)
        List<LookupDTO> lookups = new ArrayList<>()
        lookups.add(lookup)

        when: "调用方法"
        iLookupService.queryByCode(lookup)

        then: "校验结果"
        1 * lookupRepository.select(_) >> { lookups }
        1 * lookupValueRepository.selectByLookupId(_) >> { new ArrayList<LookupValueDTO>() }
    }
}