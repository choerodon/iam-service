package io.choerodon.iam.app.service.impl

import io.choerodon.asgard.saga.feign.SagaClient
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.IntegrationTestConfiguration
import io.choerodon.iam.app.service.RoleMemberService
import io.choerodon.iam.infra.asserts.UserAssertHelper
import io.choerodon.iam.infra.common.utils.excel.ExcelImportUserTask
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.mapper.ClientMapper
import io.choerodon.iam.infra.mapper.LabelMapper
import io.choerodon.iam.infra.mapper.MemberRoleMapper
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import io.choerodon.iam.infra.mapper.RoleMapper
import io.choerodon.iam.infra.mapper.UploadHistoryMapper
import org.apache.http.entity.ContentType
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.mock.web.MockMultipartFile
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT

/**
 * @author dengyouquan*      */
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(IntegrationTestConfiguration)
class RoleMemberServiceImplSpec extends Specification {

    @Autowired
    ExcelImportUserTask excelImportUserTask
    @Autowired
    ExcelImportUserTask.FinishFallback finishFallback
    @Autowired
    OrganizationMapper organizationMapper
    @Autowired
    ProjectMapper projectMapper
    @Autowired
    MemberRoleMapper memberRoleMapper
    @Autowired
    RoleMapper roleMapper
    @Autowired
    UserAssertHelper userAssertHelper
    SagaClient sagaClient = Mock(SagaClient)
    @Autowired
    LabelMapper labelMapper
    @Autowired
    ClientMapper clientMapper
    @Autowired
    UploadHistoryMapper UploadHistoryMapper


    RoleMemberService roleMemberService

    def setup() {
        given: "构造 roleMemberService"
        roleMemberService = new RoleMemberServiceImpl(excelImportUserTask, finishFallback,
                organizationMapper, projectMapper, memberRoleMapper, roleMapper,userAssertHelper, sagaClient,
                labelMapper, clientMapper, UploadHistoryMapper)
        
        DetailsHelper.setCustomUserDetails(1L,"zh_CN")
    }

    @Transactional
    def "Import2MemberRole"() {
        given: "构造请求参数"
        File excelFile = new File(this.class.getResource('/templates/roleAssignment.xlsx').toURI())
        FileInputStream fileInputStream = new FileInputStream(excelFile)
        MultipartFile multipartFile = new MockMultipartFile(excelFile.getName(),
                excelFile.getName(), ContentType.APPLICATION_OCTET_STREAM.toString(),
                fileInputStream)
        

        when: "调用方法"
        roleMemberService.import2MemberRole(0L, "site", multipartFile)

        then: "校验结果"
        noExceptionThrown()
    }
}
