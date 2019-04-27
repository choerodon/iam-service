package io.choerodon.iam.infra.repository.impl

import io.choerodon.core.exception.CommonException
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.domain.repository.UploadHistoryRepository
import io.choerodon.iam.infra.dataobject.UploadHistoryDO
import io.choerodon.iam.infra.mapper.UploadHistoryMapper
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class UploadHistoryRepositoryImplSpec extends Specification {
    private UploadHistoryMapper uploadHistoryMapper = Mock(UploadHistoryMapper)
    private UploadHistoryRepository uploadHistoryRepository

    def setup() {
        uploadHistoryRepository = new UploadHistoryRepositoryImpl(uploadHistoryMapper)
    }

    def "InsertSelective"() {
        given: "构造请求参数"
        UploadHistoryDO uploadHistoryDO = new UploadHistoryDO()

        when: "调用方法[异常]"
        uploadHistoryRepository.insertSelective(uploadHistoryDO)

        then: "校验结果"
        1 * uploadHistoryMapper.insertSelective(_) >> 0
        def exception = thrown(CommonException)
        exception.message.equals("error.uploadHistory.insert")

        when: "调用方法"
        uploadHistoryRepository.insertSelective(uploadHistoryDO)

        then: "校验结果"
        1 * uploadHistoryMapper.insertSelective(_) >> 1
        1 * uploadHistoryMapper.selectByPrimaryKey(_)
        0 * _
    }

    def "SelectByPrimaryKey"() {
        when: "调用方法"
        uploadHistoryRepository.selectByPrimaryKey(1L)

        then: "校验结果"
        1 * uploadHistoryMapper.selectByPrimaryKey(_)
        0 * _
    }

    def "UpdateByPrimaryKeySelective"() {
        given: "构造请求参数"
        UploadHistoryDO uploadHistoryDO = new UploadHistoryDO()
        UploadHistoryDO uploadHistoryDO1 = new UploadHistoryDO()

        when: "调用方法[异常]"
        uploadHistoryRepository.updateByPrimaryKeySelective(uploadHistoryDO)

        then: "校验结果"
        def exception = thrown(CommonException)
        exception.message.equals("error.update.dataObject.id.null")

        when: "调用方法[异常]"
        uploadHistoryDO.setId(1L)
        uploadHistoryRepository.updateByPrimaryKeySelective(uploadHistoryDO)

        then: "校验结果"
        exception = thrown(CommonException)
        exception.message.equals("error.update.dataObject.objectVersionNumber.null")

        when: "调用方法[异常]"
        uploadHistoryDO.setObjectVersionNumber(1L)
        uploadHistoryDO1.setObjectVersionNumber(0L)
        uploadHistoryRepository.updateByPrimaryKeySelective(uploadHistoryDO)

        then: "校验结果"
        exception = thrown(CommonException)
        exception.message.equals("error.update.dataObject.objectVersionNumber.not.equal")
        1 * uploadHistoryMapper.selectByPrimaryKey(_) >> { uploadHistoryDO1 }

        when: "调用方法[异常]"
        uploadHistoryDO1.setObjectVersionNumber(1L)
        uploadHistoryRepository.updateByPrimaryKeySelective(uploadHistoryDO)

        then: "校验结果"
        exception = thrown(CommonException)
        exception.message.equals("error.uploadHistory.update")
        1 * uploadHistoryMapper.selectByPrimaryKey(_) >> { uploadHistoryDO1 }
        1 * uploadHistoryMapper.updateByPrimaryKeySelective(_) >> 0

        when: "调用方法"
        uploadHistoryDO1.setObjectVersionNumber(1L)
        uploadHistoryRepository.updateByPrimaryKeySelective(uploadHistoryDO)

        then: "校验结果"
        2 * uploadHistoryMapper.selectByPrimaryKey(_) >> { uploadHistoryDO1 }
        1 * uploadHistoryMapper.updateByPrimaryKeySelective(_) >> 1
    }
}
