package io.choerodon.iam.infra.repository.impl

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.LookupValueRepository
import io.choerodon.iam.infra.dto.LookupValueDTO
import io.choerodon.iam.infra.mapper.LookupValueMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LookupValueRepositoryImplSpec extends Specification {
    private LookupValueMapper mapper = Mock(LookupValueMapper)
    private LookupValueRepository lookupValueRepository

    def setup() {
        lookupValueRepository = new LookupValueRepositoryImpl(mapper)
    }

    def "Insert"() {
        given: "构造请求参数"
        LookupValueDTO lookupValue = new LookupValueDTO()

        when: "调用方法[异常]"
        lookupValueRepository.insert(lookupValue)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.lookupValue.insert")
        1 * mapper.insertSelective(_) >> 0

        when: "调用方法"
        lookupValueRepository.insert(lookupValue)

        then: "校验结果"
        1 * mapper.insertSelective(_) >> 1
        1 * mapper.selectByPrimaryKey(_) >> { new LookupValueDTO() }
    }

    def "DeleteById"() {
        when: "调用方法[异常]"
        lookupValueRepository.deleteById(1L)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.lookupValue.delete")
        1 * mapper.deleteByPrimaryKey(_) >> 0
    }

    def "UpdateById"() {
        given: "构造请求参数"
        LookupValueDTO lookupValue = new LookupValueDTO()
        def id = 1L

        when: "调用方法[异常]"
        lookupValueRepository.updateById(lookupValue, id)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.lookupValue.notExist")
        1 * mapper.selectByPrimaryKey(_)

        when: "调用方法"
        lookupValueRepository.updateById(lookupValue, id)

        then: "校验结果"
        1 * mapper.updateByPrimaryKeySelective(lookupValue)
        2 * mapper.selectByPrimaryKey(_) >> { new LookupValueDTO() }
    }

    def "Delete"() {
        when: "调用方法"
        lookupValueRepository.delete(new LookupValueDTO())

        then: "校验结果"
        1 * mapper.delete(_)
    }
}
