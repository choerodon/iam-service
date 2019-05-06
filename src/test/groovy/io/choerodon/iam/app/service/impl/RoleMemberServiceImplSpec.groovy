package io.choerodon.iam.app.service.impl

import io.choerodon.core.convertor.ConvertHelper
import io.choerodon.core.excel.ExcelReadHelper
import io.choerodon.core.oauth.DetailsHelper
import io.choerodon.iam.api.dto.ExcelMemberRoleDTO
import io.choerodon.iam.api.dto.UploadHistoryDTO
import io.choerodon.iam.app.service.RoleMemberService
import io.choerodon.iam.domain.repository.MemberRoleRepository
import io.choerodon.iam.domain.repository.UploadHistoryRepository
import io.choerodon.iam.domain.service.IRoleMemberService
import io.choerodon.iam.infra.common.utils.SpockUtils
import io.choerodon.iam.infra.common.utils.excel.ExcelImportUserTask
import io.choerodon.iam.infra.dto.OrganizationDTO
import io.choerodon.iam.infra.mapper.OrganizationMapper
import io.choerodon.iam.infra.mapper.ProjectMapper
import org.junit.runner.RunWith
import org.mockito.Mockito
import org.powermock.api.mockito.PowerMockito
import org.powermock.core.classloader.annotations.PrepareForTest
import org.powermock.modules.junit4.PowerMockRunner
import org.powermock.modules.junit4.PowerMockRunnerDelegate
import org.spockframework.runtime.Sputnik
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification
/**
 * @author dengyouquan
 * */
@RunWith(PowerMockRunner)
@PowerMockRunnerDelegate(Sputnik)
@PrepareForTest([DetailsHelper, ConvertHelper, ExcelReadHelper])
class RoleMemberServiceImplSpec extends Specification {
    private IRoleMemberService iRoleMemberService = Mock(IRoleMemberService)
    private UploadHistoryRepository uploadHistoryRepository = Mock(UploadHistoryRepository)
    private ExcelImportUserTask excelImportUserTask = Mock(ExcelImportUserTask)
    private OrganizationMapper organizationMapper = Mock(OrganizationMapper)
    private ProjectMapper projectMapper = Mock(ProjectMapper)
    private ExcelImportUserTask.FinishFallback finishFallback = Mock(ExcelImportUserTask.FinishFallback)
    private MemberRoleRepository memberRoleRepository = Mock(MemberRoleRepository)
    private RoleMemberService roleMemberService
    private Long userId

    def setup() {
        given: "构造 roleMemberService"
        roleMemberService = new RoleMemberServiceImpl(iRoleMemberService,
                uploadHistoryRepository, excelImportUserTask, finishFallback,
                organizationMapper, projectMapper, memberRoleRepository)

        and: "mock静态方法-CustomUserDetails"
        PowerMockito.mockStatic(DetailsHelper)
        PowerMockito.when(DetailsHelper.getUserDetails()).thenReturn(SpockUtils.getCustomUserDetails())
        userId = DetailsHelper.getUserDetails().getUserId()
    }

    def "Import2MemberRole"() {
        given: "构造请求参数"
        Long sourceId = 1L
        String sourceType = "organization"
        MultipartFile file = null

        and: "mock静态方法-ExcelReadHelper"
        ExcelMemberRoleDTO memberRoleDTO = new ExcelMemberRoleDTO()
        List<ExcelMemberRoleDTO> memberRoles = new ArrayList<>()
        memberRoles.add(memberRoleDTO)
        PowerMockito.mockStatic(ExcelReadHelper)
        PowerMockito.when(ExcelReadHelper.read(Mockito.any(), Mockito.any(), Mockito.any()))
                .thenReturn(memberRoles)

        when: "调用方法"
        roleMemberService.import2MemberRole(sourceId, sourceType, file)

        then: "校验结果"
        noExceptionThrown()
        1 * organizationMapper.selectByPrimaryKey(_) >> { new OrganizationDTO() }
        1 * uploadHistoryRepository.insertSelective(_) >> { new UploadHistoryDTO() }
        1 * excelImportUserTask.importMemberRole(_, _, finishFallback)
    }
}
