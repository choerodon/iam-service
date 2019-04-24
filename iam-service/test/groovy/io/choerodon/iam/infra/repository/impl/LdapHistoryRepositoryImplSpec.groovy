package io.choerodon.iam.infra.repository.impl

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.LdapHistoryRepository
import io.choerodon.iam.infra.dataobject.LdapHistoryDO
import io.choerodon.iam.infra.mapper.LdapHistoryMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class LdapHistoryRepositoryImplSpec extends Specification {
    private LdapHistoryMapper ldapHistoryMapper = Mock(LdapHistoryMapper)
    private LdapHistoryRepository ldapHistoryRepository

    def setup() {
        ldapHistoryRepository = new LdapHistoryRepositoryImpl(ldapHistoryMapper)
    }

    def "InsertSelective"() {
        given: "构造请求参数"
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()

        when: "调用方法[异常]"
        ldapHistoryRepository.insertSelective(ldapHistoryDO)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.ldapHistory.insert")
        1 * ldapHistoryMapper.insertSelective(_) >> 0

        when: "调用方法"
        ldapHistoryRepository.insertSelective(ldapHistoryDO)

        then: "校验结果"
        1 * ldapHistoryMapper.insertSelective(_) >> 1
        1 * ldapHistoryMapper.selectByPrimaryKey(_)
    }

    def "UpdateByPrimaryKeySelective"() {
        given: "构造请求参数"
        LdapHistoryDO ldapHistoryDO = new LdapHistoryDO()

        when: "调用方法[异常]"
        ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDO)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.ldapHistory.update")
        1 * ldapHistoryMapper.updateByPrimaryKeySelective(_) >> 0

        when: "调用方法"
        ldapHistoryRepository.updateByPrimaryKeySelective(ldapHistoryDO)

        then: "校验结果"
        1 * ldapHistoryMapper.updateByPrimaryKeySelective(_) >> 1
        1 * ldapHistoryMapper.selectByPrimaryKey(_)
    }
}
