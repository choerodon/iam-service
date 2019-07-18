package io.choerodon.iam.api.service.impl

import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.ExcelService
import io.choerodon.iam.app.service.impl.ExcelServiceImpl
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.common.utils.excel.ExcelImportUserTask
import io.choerodon.iam.infra.mapper.UploadHistoryMapper
import org.apache.http.entity.ContentType
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.mock.web.MockMultipartFile
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT


/**
 * @author dengyouquan
 * */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class ExcelServiceImplSpec extends Specification {

//    private UploadHistoryRepository uploadHistoryRepository = Mock(UploadHistoryRepository)

    @Autowired
    private ExcelImportUserTask excelImportUserTask
    @Autowired
    private ExcelImportUserTask.FinishFallback finishFallback
    @Autowired
    UploadHistoryMapper uploadHistoryMapper

    @Transactional
    def "ImportUsers"() {
        given: "构造请求数据"
        DetailsHelper.setCustomUserDetails(1L,"zh_CN")
        File excelFile = new File(this.class.getResource('/templates/userTemplates.xlsx').toURI())
        FileInputStream fileInputStream = new FileInputStream(excelFile)
        MultipartFile multipartFile = new MockMultipartFile(excelFile.getName(),
                excelFile.getName(), ContentType.APPLICATION_OCTET_STREAM.toString(),
                fileInputStream)

        ExcelService excelService = new ExcelServiceImpl(excelImportUserTask, finishFallback, uploadHistoryMapper)


        when: "调用方法"
        excelService.importUsers(1L, multipartFile)

        then: "校验结果"
        noExceptionThrown()
    }
}
