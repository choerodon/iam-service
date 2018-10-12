package io.choerodon.iam.api.service.impl

import io.choerodon.core.oauth.CustomUserDetails
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.app.service.ExcelService
import io.choerodon.iam.app.service.impl.ExcelServiceImpl
import io.choerodon.iam.domain.repository.UploadHistoryRepository
import io.choerodon.iam.infra.common.utils.excel.ExcelImportUserTask
import org.apache.http.entity.ContentType
import org.junit.runner.RunWith
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.mock.web.MockMultipartFile
import org.springframework.security.core.GrantedAuthority
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification


/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper])
class ExcelServiceImplSpec extends Specification {

    private UploadHistoryRepository uploadHistoryRepository = Mock(UploadHistoryRepository)

    private ExcelImportUserTask excelImportUserTask = Mock(ExcelImportUserTask)
    private ExcelImportUserTask.FinishFallback finishFallback =
            Mock(ExcelImportUserTask.FinishFallback)

    private ExcelService excelService = new ExcelServiceImpl(uploadHistoryRepository, excelImportUserTask, finishFallback)

    def "ImportUsers"() {
        given: "构造请求数据"
        File excelFile = new File(this.class.getResource('/templates/userTemplates.xlsx').toURI())
        FileInputStream fileInputStream = new FileInputStream(excelFile)
        MultipartFile multipartFile = new MockMultipartFile(excelFile.getName(),
                excelFile.getName(), ContentType.APPLICATION_OCTET_STREAM.toString(),
                fileInputStream)

        and: "mock静态方法"
        def authorities = new ArrayList<GrantedAuthority>()
        def customUserDetails = new CustomUserDetails("dengyouquan", "123456", authorities)
        customUserDetails.setOrganizationId(1L)
        customUserDetails.setEmail("dengyouquan@qq.com")
        customUserDetails.setAdmin(true)
        customUserDetails.setTimeZone("CTT")
        customUserDetails.setUserId(1L)
        customUserDetails.setLanguage("zh_CN")
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(customUserDetails)

        when: "调用方法"
        excelService.importUsers(1L, multipartFile)

        then: "校验结果"
        noExceptionThrown()
        1 * uploadHistoryRepository.insertSelective(_)
        1 * excelImportUserTask.importUsers(_, _, _, _, _)
    }
}
